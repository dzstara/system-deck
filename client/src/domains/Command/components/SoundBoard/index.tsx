import { LazyDataOrModifiedFn } from "use-async-resource";
import { SoundBoardResourceWrapper, server } from "services/server";
import Icon from "components/Icon";
import "./style.css";
import classNames from "classnames";

export default function SoundBoardWrapper() {
  return <SoundBoardResourceWrapper component={SoundBoardContent} />;
}

function SoundBoardContent({
  resource,
}: {
  resource: LazyDataOrModifiedFn<string[]>;
}) {
  const list = resource()!;

  return (
    <div className="SoundBoardContent">
      {list.map((item) => (
        <SoundBoardItem key={item} item={item} />
      ))}
    </div>
  );
}

function SoundBoardItem({ item }: { item: string }) {
  const onPlay = () => {
    server.send(JSON.stringify({ type: "LaunchSoundboardItem", data: item }));
  };

  const onStop = () => {
    server.send(JSON.stringify({ type: "StopSoundboardItem", data: item }));
  };

  const name = item.split(".").slice(0, -1).join(".");

  return (
    <div className="SoundBoardItem">
      <div
        className={classNames(
          "SoundBoardItem--control",
          "SoundBoardItem--name"
        )}
        onClick={onPlay}
      >
        <div>{name}</div>

        <div>
          <Icon name="play_arrow" />
        </div>
      </div>

      <div className="SoundBoardItem--control" onClick={onStop}>
        <Icon name="stop" />
      </div>
    </div>
  );
}
