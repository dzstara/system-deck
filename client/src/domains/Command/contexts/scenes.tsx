import { useCallback, useEffect, useState } from "react";
import { obs } from "services/obs";
import { generateContext } from "util/context";

const {
  ContextProvider: ScenesContextProvider,
  useThisContext: useScenes,
} = generateContext(
  {
    currentScene: null,
    scenes: [],
    switchToScene: () => {},
  },
  useScenesData
);

export { ScenesContextProvider, useScenes };

interface SceneContextState {
  currentScene: string | null;
  scenes: Array<string>;
}

function useScenesData() {
  const [state, setState] = useState<SceneContextState>({
    currentScene: null,
    scenes: [],
  });

  const switchToScene = (sceneName: string) => {
    obs.send("SetCurrentScene", { "scene-name": sceneName });
  };

  const switchSceneListener = useCallback((data: { "scene-name": string }) => {
    setState((state) => ({ ...state, currentScene: data["scene-name"] }));
  }, []);

  useEffect(() => {
    obs.on("SwitchScenes", switchSceneListener);

    return () => {
      obs.off("SwitchScenes", switchSceneListener);
    };
  }, [switchSceneListener]);

  useEffect(() => {
    getScenesData()
      .then((response) => {
        setState({
          currentScene: response["current-scene"],
          scenes: response.scenes.map((scene) => scene.name),
        });
      })
      .catch((error) => {
        console.error("Could not connect!", error);
      });
  }, []);

  return {
    ...state,
    switchToScene,
  };
}

function getScenesData() {
  return obs.send("GetSceneList");
}
