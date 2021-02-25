import OBSWebSocket, { Scene } from "obs-websocket-js";
import { useEffect, useState } from "react";
import "./style.css";

const password = process.env.REACT_APP_OBS_WS_PASSWORD;
const origin = window.location.hostname;

const obs = new OBSWebSocket();

export default function App() {
  const [scenes, setScenes] = useState<Array<Scene>>([]);

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
      })
      .catch((error) => {
        console.error("Could not connect!", error);
      });
  }, []);

  const switchToScene = (sceneName: string) => {
    obs.send("SetCurrentScene", { "scene-name": sceneName });
  };

  return (
    <ul>
      {scenes.map((scene) => (
        <li key={scene.name} onClick={() => switchToScene(scene.name)}>
          {scene.name}
        </li>
      ))}
    </ul>
  );
}
