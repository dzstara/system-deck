import { useCallback, useState } from "react";
import { useLocalStorage } from "react-use";
import { useSources } from "domains/Command/contexts/sources";
import SoundControlItem from "./SoundControlItem";
import "./style.css";
import Icon from "components/Icon";

export default function SoundControl() {
  const sources = useSources();
  const [showHidden, setShowHidden] = useState(false);
  const [hiddenSources, setHiddenSources] = useLocalStorage<Array<string>>(
    "Command::hidden-sources",
    []
  );

  const toggleHidden = useCallback(
    (source: string) => {
      setHiddenSources((hiddenSources = []) => {
        if (hiddenSources.includes(source))
          return hiddenSources.filter((s) => s !== source);
        else return [...hiddenSources, source];
      });
    },
    [setHiddenSources]
  );

  const shownSources = sources.filter((s) => !hiddenSources?.includes(s));

  return (
    <div className="SoundControl">
      <div className="SoundControl--list">
        {shownSources.map((source) => (
          <SoundControlItem
            key={source}
            source={source}
            hidden={shownSources.includes(source)}
            toggleHidden={() => toggleHidden(source)}
          />
        ))}
      </div>

      <div
        className="SoundControl--expand"
        onClick={() => setShowHidden((showHidden) => !showHidden)}
      >
        <span>
          <Icon name={showHidden ? "expand_less" : "expand_more"} />
        </span>
        <span>Show hidden</span>
      </div>

      {showHidden && (
        <div className="SoundControl--list">
          {hiddenSources?.map((source) => (
            <SoundControlItem
              key={source}
              source={source}
              hidden={hiddenSources.includes(source)}
              toggleHidden={() => toggleHidden(source)}
            />
          )) ?? null}
        </div>
      )}
    </div>
  );
}
