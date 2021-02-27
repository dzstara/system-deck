import { useState, useEffect, useCallback } from "react";
import classNames from "classnames";
import { Scene } from "obs-websocket-js";
import { obs } from "services/obs";
import "./style.css";

export default function SceneSwitcher() {
  const [currentScene, setCurrentScene] = useState<string | null>(null);
  const [scenes, setScenes] = useState<Array<Scene> | null>(null);

  const switchSceneListener = useCallback((data: { "scene-name": string }) => {
    setCurrentScene(data["scene-name"]);
  }, []);

  useEffect(() => {
    obs.on("SwitchScenes", switchSceneListener);

    return () => {
      obs.off("SwitchScenes", switchSceneListener);
    };
  }, [switchSceneListener]);

  useEffect(() => {
    obs
      .send("GetSceneList")
      .then((response) => {
        setScenes(response.scenes);
        setCurrentScene(response["current-scene"]);
      })
      .catch((error) => {
        console.error("Could not connect!", error);
      });
  }, []);

  const switchToScene = (sceneName: string) => {
    obs.send("SetCurrentScene", { "scene-name": sceneName });
  };

  return scenes ? (
    <div className="SceneSwitcher">
      {scenes.map((scene) => {
        const isCurrentScene = currentScene === scene.name;
        return (
          <div
            key={scene.name}
            onClick={() => switchToScene(scene.name)}
            className={classNames("SceneSwitcher--item", {
              "SceneSwitcher--current": isCurrentScene,
            })}
          >
            {scene.name}
          </div>
        );
      })}
    </div>
  ) : (
    <div>Loading scenes</div>
  );
}
