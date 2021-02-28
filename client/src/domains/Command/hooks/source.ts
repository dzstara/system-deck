import { Volume } from "domains/Command/types";
import { useState, useCallback, useEffect } from "react";
import { obs } from "services/obs";

export function useSource(name: string) {
  const [data, setData] = useState<Volume>({
    volume: 1,
    muted: false,
  });

  const setVolume = (volume: number) => {
    obs.send("SetVolume", { source: name, volume: Math.pow(volume, 4) });
  };

  const toggleMute = () => {
    obs.send("ToggleMute", { source: name });
  };

  const sourceVolumeChangedListener = useCallback(
    (event: { sourceName: string; volume: number }) => {
      if (event.sourceName !== name) return;

      setData((data) => ({
        ...data,
        volume: event.volume,
      }));
    },
    [name]
  );

  const sourceMuteStateChangedListener = useCallback(
    (event: { sourceName: string; muted: boolean }) => {
      if (event.sourceName !== name) return;

      setData((data) => ({
        ...data,
        muted: event.muted,
      }));
    },
    [name]
  );

  useEffect(() => {
    let cancelled = false;

    obs.on("SourceVolumeChanged", sourceVolumeChangedListener);
    obs.on("SourceMuteStateChanged", sourceMuteStateChangedListener);

    getVolumeData(name).then((data) => {
      if (!cancelled) setData(data);
    });

    return () => {
      obs.off("SourceVolumeChanged", sourceVolumeChangedListener);
      obs.off("SourceMuteStateChanged", sourceMuteStateChangedListener);

      cancelled = true;
    };
  }, [sourceMuteStateChangedListener, sourceVolumeChangedListener, name]);

  const realVolume = Math.pow(data.volume, 1 / 4);

  return {
    volume: realVolume,
    setVolume,

    muted: data.muted,
    toggleMute,
  };
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
