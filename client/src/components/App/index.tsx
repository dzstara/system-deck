import classNames from "classnames";
import OBSWebSocket, { Scene } from "obs-websocket-js";
import { useEffect, useState } from "react";
import "./style.css";

const password = process.env.REACT_APP_OBS_WS_PASSWORD;
const origin = window.location.hostname;

const obs = new OBSWebSocket();

export default function App() {
  const [currentScene, setCurrentScene] = useState<string | null>(null);
  const [scenes, setScenes] = useState<Array<Scene> | null>(null);

  useEffect(() => {
    console.log("Connecting... ");
    obs
      .connect({
        address: origin + ":4444",
        password,
      })
      .then(() => {
        console.log(`Success! We're connected & authenticated.`);

        return obs.send("GetSceneList");
      })
      .then((response) => {
        setScenes(response.scenes);
        setCurrentScene(response["current-scene"]);

        obs.on("SwitchScenes", (data) => {
          setCurrentScene(data["scene-name"]);
        });
      })
      .catch((error) => {
        console.error("Could not connect!", error);
      });
  }, []);

  const switchToScene = (sceneName: string) => {
    obs.send("SetCurrentScene", { "scene-name": sceneName });
  };

  return scenes ? (
    <ul>
      {scenes.map((scene) => {
        const isCurrentScene = currentScene === scene.name;
        return (
          <li
            key={scene.name}
            onClick={() => switchToScene(scene.name)}
            className={classNames({ current: isCurrentScene })}
          >
            {scene.name}
          </li>
        );
      })}
    </ul>
  ) : (
    <div>Loading scenes</div>
  );
}
