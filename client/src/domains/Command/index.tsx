import classNames from "classnames";
import { ServerConnection } from "util/loader";
import { connect as connectObs } from "services/obs";
import { connect as connectSb } from "services/soundboard";
import SceneSwitcher from "./SceneSwitcher";
import SoundBoard from "./SoundBoard";
import SoundControl from "./SoundControl";
import "./style.css";

function connectToSockets() {
  return Promise.all([connectObs(), connectSb()]);
}

export default function Command() {
  return (
    <ServerConnection connectFn={connectToSockets}>
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

        <div className={classNames("Command--item", "global--scrollbar-style")}>
          <div className="Command--item--title">Soundboard</div>

          <SoundBoard />
        </div>
      </div>
    </ServerConnection>
  );
}
