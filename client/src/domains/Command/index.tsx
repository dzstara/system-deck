import classNames from "classnames";
import { ObsLoader } from "util/obs";
import SceneSwitcher from "domains/Command/SceneSwitcher";
import SoundControl from "domains/Command/SoundControl";
import "./style.css";

export default function Command() {
  return (
    <ObsLoader>
      <div className={classNames("Command--grid", "global--scrollbar-style")}>
        <div className="Command--title">System Deck</div>

        <div className={classNames("Command--item", "global--scrollbar-style")}>
          <div className="Command--item--title">Scenes</div>

          <SceneSwitcher />
        </div>

        <div className={classNames("Command--item", "global--scrollbar-style")}>
          <div className="Command--item--title">Volume</div>

          <SoundControl />
        </div>
      </div>
    </ObsLoader>
  );
}
