import { FC } from "react";
import {
  AsyncResourceContent,
  LazyDataOrModifiedFn,
  useAsyncResource,
} from "use-async-resource";

const origin = window.location.hostname;
const address = origin + ":8020";

const serverURL = "http://" + window.location.hostname + ":8010";

export const soundBoardFilePath = serverURL + "/soundboard/static/";

export let server: WebSocket;

export function connect() {
  return new Promise<void>((resolve, reject) => {
    server = new WebSocket("ws://" + address);

    server.addEventListener("open", function open() {
      resolve();
    });

    server.addEventListener("error", function error(ev: Event) {
      reject(ev);
    });
  });
}

export async function fetchSoundboard() {
  const response = await fetch(serverURL + "/soundboard/");
  const list: Array<string> = await response.json();
  return list.sort();
}

export function SoundBoardResourceWrapper({
  component: Component,
}: {
  component: FC<{ resource: LazyDataOrModifiedFn<string[]> }>;
}) {
  const [resource] = useAsyncResource(fetchSoundboard, []);

  return (
    <AsyncResourceContent
      fallback="loading your data..."
      errorMessage="Some generic message when bad things happen"
    >
      <Component resource={resource} />
    </AsyncResourceContent>
  );
}
