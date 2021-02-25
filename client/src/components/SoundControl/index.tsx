import Icon from "components/Icon";
import { useEffect, useState } from "react";
import { obs } from "util/obs";
import "./style.css";

interface Source {
  name: string;
  volume: number;
  muted: boolean;
}

export default function SoundControl() {
  const [sources, setSources] = useState<Array<Source>>([]);

  useEffect(() => {
    let cancelled = false;

    const SourceVolumeChangedListener = (data: {
      sourceName: string;
      volume: number;
    }) => {
      setSources((sources) =>
        sources.map((source) =>
          source.name === data.sourceName
            ? {
                ...source,
                volume: data.volume,
              }
            : source
        )
      );
    };

    const SourceMuteStateChangedListener = (data: {
      sourceName: string;
      muted: boolean;
    }) => {
      setSources((sources) =>
        sources.map((source) =>
          source.name === data.sourceName
            ? {
                ...source,
                muted: data.muted,
              }
            : source
        )
      );
    };

    obs.on("SourceVolumeChanged", SourceVolumeChangedListener);
    obs.on("SourceMuteStateChanged", SourceMuteStateChangedListener);

    getSourceData().then((sources) => {
      if (!cancelled) setSources(sources);
    });

    return () => {
      obs.off("SourceVolumeChanged", SourceVolumeChangedListener);
      obs.off("SourceMuteStateChanged", SourceMuteStateChangedListener);

      cancelled = true;
    };
  }, []);

  const muteSource = (source: string) => {
    obs.send("ToggleMute", { source });
  };

  return (
    <div className="SoundControl">
      {sources.map((source) => (
        <div key={source.name} className="SoundControl--item">
          <div className="SoundControl--volume">
            <div
              className="SoundControl--volume-bar"
              style={{ width: source.volume * 100 + "%" }}
            />
            <div className="SoundControl--name">
              <span>{truncateString(source.name, 14)}</span>{" "}
              <span>{Math.round(source.volume * 100)}%</span>
            </div>
          </div>

          <div
            className="SoundControl--muted"
            onClick={() => muteSource(source.name)}
          >
            <Icon name={source.muted ? "volume_off" : "volume_up"} />
          </div>
        </div>
      ))}
    </div>
  );
}

const audioTypeIds = [
  "wasapi_output_capture",
  "wasapi_input_capture",
  "soundtrack_global_source",
  "dshow_input",
];

async function getSourceData() {
  const response = await obs.send("GetSourcesList");

  return Promise.all(
    response.sources
      .filter(
        (source: any) =>
          source.type === "input" && audioTypeIds.includes(source.typeId)
      )
      .map((source: any) => source.name as string)
      .map(
        (source) =>
          new Promise<Source>((resolve, reject) =>
            obs
              .send("GetVolume", { source })
              .then((response) => {
                const sourceObject = {
                  name: source,
                  volume: response.volume,
                  muted: response.muted,
                };

                resolve(sourceObject);
              })
              .catch(reject)
          )
      )
  );
}

function truncateString(str: string, maxLength: number) {
  if (str.length < maxLength) return str;

  return str.slice(0, maxLength) + "...";
}
