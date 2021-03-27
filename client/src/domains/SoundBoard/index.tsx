import { ServerConnection } from "util/loader";
import {
  connect,
  server,
  SoundBoardResourceWrapper,
  soundBoardFilePath,
} from "services/server";
import { LazyDataOrModifiedFn } from "use-async-resource";
import { useEffect, useRef } from "react";

export default function SoundBoardWrapper() {
  return (
    <ServerConnection connectFn={connect}>
      <SoundBoardResourceWrapper component={SoundBoard} />
    </ServerConnection>
  );
}

function SoundBoard({
  resource,
}: {
  resource: LazyDataOrModifiedFn<string[]>;
}) {
  const files = resource();

  if (!files) return null;

  return (
    <>
      {files.map((file) => (
        <SoundBoardItem key={file} file={file} />
      ))}
    </>
  );
}

function SoundBoardItem({ file }: { file: string }) {
  const playerRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (
        data.type === "LaunchSoundboardItem" &&
        data.data === file &&
        !!playerRef.current
      ) {
        playerRef.current.currentTime = 0;
        playerRef.current.play();
      }

      if (
        data.type === "StopSoundboardItem" &&
        data.data === file &&
        !!playerRef.current
      ) {
        playerRef.current.pause();
        playerRef.current.currentTime = 0;
      }
    };

    server.addEventListener("message", handler);

    return () => {
      server.removeEventListener("message", handler);
    };
  }, [file]);

  return (
    <audio preload="true" src={soundBoardFilePath + file} ref={playerRef} />
  );
}
