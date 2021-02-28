import classNames from "classnames";
import { NavLink, Route, Switch } from "react-router-dom";
import DataWrapper from "./DataWrapper";
import Home from "./Home";
import SceneSwitcher from "./SceneSwitcher";
import SoundBoard from "./SoundBoard";
import SoundControl from "./SoundControl";
import Quick from "./Quick";
import "./style.css";

export default function Command() {
  return (
    <DataWrapper>
      <div className="Command">
        <div className="Command--sidebar">
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

          <div className="Command--quick">
            <Quick />
          </div>
        </div>

        <div className={classNames("Command--view", "global--scrollbar-style")}>
          <Switch>
            <Route exact path="/command/" component={Home} />
            <Route exact path="/command/scenes" component={SceneSwitcher} />
            <Route exact path="/command/volume" component={SoundControl} />
            <Route exact path="/command/soundboard" component={SoundBoard} />
          </Switch>
        </div>
      </div>
    </DataWrapper>
  );
}
