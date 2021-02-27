import { useCallback, useEffect, useRef, useState } from "react";
import { obs } from "services/obs";
import Icon from "components/Icon";

interface Volume {
  volume: number;
  muted: boolean;
}

export default function SoundControlItem({ source }: { source: string }) {
  const pointerIsActiveRef = useRef(false);
  const [data, setData] = useState<Volume>({
    volume: 1,
    muted: false,
  });

  const onVolumePointerDown = () => {
    pointerIsActiveRef.current = true;
  };

  const onVolumePointerUp = () => {
    pointerIsActiveRef.current = false;
  };

  const setVolume = (volume: number) => {
    obs.send("SetVolume", { source, volume });
  };

  const onVolumePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerIsActiveRef.current) return;

    const rect = (event.target as any).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = (event.target as HTMLElement).offsetWidth;

    setVolume(x / width);
  };

  const muteSource = () => {
    obs.send("ToggleMute", { source });
  };

  const sourceVolumeChangedListener = useCallback(
    (event: { sourceName: string; volume: number }) => {
      if (event.sourceName !== source) return;

      setData((data) => ({
        ...data,
        volume: event.volume,
      }));
    },
    [source]
  );

  const sourceMuteStateChangedListener = useCallback(
    (event: { sourceName: string; muted: boolean }) => {
      if (event.sourceName !== source) return;

      setData((data) => ({
        ...data,
        muted: event.muted,
      }));
    },
    [source]
  );

  useEffect(() => {
    let cancelled = false;

    obs.on("SourceVolumeChanged", sourceVolumeChangedListener);
    obs.on("SourceMuteStateChanged", sourceMuteStateChangedListener);

    getVolumeData(source).then((data) => {
      if (!cancelled) setData(data);
    });

    return () => {
      obs.off("SourceVolumeChanged", sourceVolumeChangedListener);
      obs.off("SourceMuteStateChanged", sourceMuteStateChangedListener);

      cancelled = true;
    };
  }, [sourceMuteStateChangedListener, sourceVolumeChangedListener, source]);

  return (
    <div className="SoundControlItem">
      <div
        className="SoundControlItem--volume"
        onPointerMove={onVolumePointerMove}
        onPointerDown={onVolumePointerDown}
        onPointerUp={onVolumePointerUp}
      >
        <div
          className="SoundControlItem--volume-bar"
          style={{ width: data.volume * 100 + "%" }}
        />

        <div className="SoundControlItem--name">
          <span>{truncateString(source, 14)}</span>{" "}
          <span>{Math.round(data.volume * 100)}%</span>
        </div>
      </div>

      <div className="SoundControlItem--muted" onClick={muteSource}>
        <Icon name={data.muted ? "volume_off" : "volume_up"} />
      </div>
    </div>
  );
}

function truncateString(str: string, maxLength: number) {
  if (str.length < maxLength) return str;

  return str.slice(0, maxLength) + "...";
}

function getVolumeData(sourceName: string) {
  return new Promise<Volume>((resolve, reject) =>
    obs
      .send("GetVolume", { source: sourceName })
      .then((response) => {
        const volumeObject = {
          volume: response.volume,
          muted: response.muted,
        };

        resolve(volumeObject);
      })
      .catch(reject)
  );
}
