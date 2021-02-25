import classNames from "classnames";
import { ObsLoader } from "util/obs";
import SceneSwitcher from "components/SceneSwitcher";
import "./style.css";

export default function App() {
  return (
    <ObsLoader>
      <div className={classNames("App--grid", "global--scrollbar-style")}>
        <div className={classNames("App--item", "global--scrollbar-style")}>
          <div className="App--item--title">Scenes</div>

          <SceneSwitcher />
        </div>
      </div>
    </ObsLoader>
  );
}
