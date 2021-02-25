import OBSWebSocket from "obs-websocket-js";
import { PropsWithChildren, useEffect, useState } from "react";

const password = process.env.REACT_APP_OBS_WS_PASSWORD;
const origin = window.location.hostname;
const address = origin + ":4444";

export const obs = new OBSWebSocket();

interface ObsLoaderState {
  error: Error | null;
  loading: boolean;
}

export function ObsLoader({ children }: PropsWithChildren<{}>) {
  const [state, setState] = useState<ObsLoaderState>({
    error: null,
    loading: true,
  });

  useEffect(() => {
    setState({
      loading: true,
      error: null,
    });

    console.log(`Connecting to ${address}...`);

    obs
      .connect({
        address,
        password,
      })
      .then(() => {
        setState({
          loading: false,
          error: null,
        });
        console.log("Connected to OBS.");
      })
      .catch((error) => {
        setState({
          loading: false,
          error,
        });
        console.error("Error trying to connect to OBS!");
        console.error(error);
      });
  }, []);

  if (state.loading) {
    return <div>Connecting to OBS...</div>;
  }

  if (state.error) {
    return (
      <div>
        <p>Could not connect to OBS!</p>

        <pre>{state.error.toString()}</pre>
      </div>
    );
  }

  return <>{children}</>;
}
