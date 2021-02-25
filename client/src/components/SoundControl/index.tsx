import { useEffect, useState } from "react";
import { obs } from "util/obs";
import SoundControlItem from "./SoundControlItem";
import "./style.css";

export default function SoundControl() {
  const [sources, setSources] = useState<Array<string>>([]);

  useEffect(() => {
    let cancelled = false;

    getSourceData().then((sources) => {
      if (!cancelled) setSources(sources);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="SoundControl">
      {sources.map((source) => (
        <SoundControlItem key={source} source={source} />
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

  return response.sources
    .filter(
      (source: any) =>
        source.type === "input" && audioTypeIds.includes(source.typeId)
    )
    .map((source: any) => source.name as string);
}
