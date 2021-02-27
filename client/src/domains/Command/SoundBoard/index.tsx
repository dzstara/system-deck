import { LazyDataOrModifiedFn } from "use-async-resource";
import { SoundBoardResourceWrapper, sb } from "services/soundboard";
import "./style.css";
import Icon from "components/Icon";

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
    sb.send(JSON.stringify({ type: "LaunchSoundboardItem", data: item }));
  };

  const onStop = () => {
    sb.send(JSON.stringify({ type: "StopSoundboardItem", data: item }));
  };

  const name = item.split(".").slice(0, -1).join(".");

  return (
    <div className="SoundBoardItem">
      <div className="SoundBoardItem--name">{name}</div>
      <div className="SoundBoardItem--controls">
        <div onClick={onPlay}>
          <Icon name="play_arrow" />
        </div>

        <div onClick={onStop}>
          <Icon name="stop" />
        </div>
      </div>
    </div>
  );
}
