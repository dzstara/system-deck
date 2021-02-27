import classNames from "classnames";
import { NavLink, Route, Switch } from "react-router-dom";
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
      <div className="Command">
        <div
          className={classNames("Command--sidebar", "global--scrollbar-style")}
        >
          <div className="Command--title">System Deck</div>

          <div className="Command--navbar">
            <NavLink
              to="/command/scenes"
              className="Command--navbar--item"
              activeClassName="Command--navbar--item-selected"
            >
              Scenes
            </NavLink>

            <NavLink
              to="/command/volume"
              className="Command--navbar--item"
              activeClassName="Command--navbar--item-selected"
            >
              Volume
            </NavLink>

            <NavLink
              to="/command/soundboard"
              className="Command--navbar--item"
              activeClassName="Command--navbar--item-selected"
            >
              Soundboard
            </NavLink>
          </div>
        </div>

        <div className={classNames("Command--view", "global--scrollbar-style")}>
          <Switch>
            <Route exact path="/command/scenes" component={SceneSwitcher} />
            <Route exact path="/command/volume" component={SoundControl} />
            <Route exact path="/command/soundboard" component={SoundBoard} />
          </Switch>
        </div>
      </div>
    </ServerConnection>
  );
}
