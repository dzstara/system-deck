import { useEffect, useState } from "react";
import { obs } from "services/obs";
import { generateContext } from "util/context";

const {
  ContextProvider: SourcesContextProvider,
  useThisContext: useSources,
} = generateContext([], useSourcesData);

export { SourcesContextProvider, useSources };

const audioTypeExcludeList = [
  "group",
  "text_gdiplus_v2",
  "color_source_v3",
  "image_source",
  "game_capture",
];

function useSourcesData() {
  const [sources, setSources] = useState<Array<string>>([]);

  useEffect(() => {
    let cancelled = false;

    getSourcesData().then((sources) => {
      if (!cancelled) setSources(sources);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return sources;
}

async function getSourcesData() {
  const response = await obs.send("GetSourcesList");

  console.log({ sources: response.sources });

  return response.sources
    .filter(
      (source: any) =>
        source.type === "input" && !audioTypeExcludeList.includes(source.typeId)
    )
    .map((source: any) => source.name as string)
    .sort();
}
