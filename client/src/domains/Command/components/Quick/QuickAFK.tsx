import classNames from "classnames";
import { usePrevious } from "react-use";
import { useScenes } from "domains/Command/contexts/scenes";

const afkSceneName = process.env.REACT_APP_AFK_SCENE_NAME ?? "";

export default function QuickAFK() {
  const { currentScene, switchToScene } = useScenes();
  const previousScene = usePrevious(currentScene);

  const currentlyAfk = currentScene === afkSceneName;

  const onClick = () => {
    if (currentlyAfk && !!previousScene) switchToScene(previousScene);
    else switchToScene(afkSceneName);
  };

  return (
    <div
      className={classNames("Quick--item", "QuickAFK", {
        "Quick--item--active": currentlyAfk,
      })}
      onClick={onClick}
    >
      AFK
    </div>
  );
}
