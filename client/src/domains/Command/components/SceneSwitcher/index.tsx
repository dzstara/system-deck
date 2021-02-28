import classNames from "classnames";
import { useScenes } from "domains/Command/contexts/scenes";
import "./style.css";

export default function SceneSwitcher() {
  const { scenes, currentScene, switchToScene } = useScenes();

  return (
    <div className="SceneSwitcher">
      {scenes.map((scene) => {
        const isCurrentScene = currentScene === scene;
        return (
          <div
            key={scene}
            onClick={() => switchToScene(scene)}
            className={classNames("SceneSwitcher--item", {
              "SceneSwitcher--current": isCurrentScene,
            })}
          >
            {scene}
          </div>
        );
      })}
    </div>
  );
}
