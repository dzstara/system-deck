import OBSWebSocket from "obs-websocket-js";

const password = process.env.REACT_APP_OBS_WS_PASSWORD;
const origin = window.location.hostname;
const address = origin + ":4444";

export const obs = new OBSWebSocket();

export function connect() {
  return obs.connect({
    address,
    password,
  });
}
