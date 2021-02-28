import { useRef } from "react";
import classNames from "classnames";
import Icon from "components/Icon";
import { useSource } from "domains/Command/hooks/source";

export default function SoundControlItem({
  source,
  hidden,
  toggleHidden,
}: {
  source: string;
  hidden: boolean;
  toggleHidden: () => unknown;
}) {
  const { volume, setVolume, muted, toggleMute } = useSource(source);
  const pointerIsActiveRef = useRef(false);

  const onVolumePointerDown = () => {
    pointerIsActiveRef.current = true;
  };

  const onVolumePointerUp = () => {
    pointerIsActiveRef.current = false;
  };

  const onVolumeClick = (
    event: React.MouseEvent<HTMLDivElement> | React.PointerEvent<HTMLDivElement>
  ) => {
    const percent = getPercentX(event);
    setVolume(percent);
  };

  const onVolumePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerIsActiveRef.current) return;

    const percent = getPercentX(event);
    setVolume(percent);
  };

  return (
    <div className="SoundControlItem">
      <div
        className="SoundControlItem--volume"
        onClick={onVolumeClick}
        onPointerMove={onVolumePointerMove}
        onPointerDown={onVolumePointerDown}
        onPointerUp={onVolumePointerUp}
      >
        <div
          className="SoundControlItem--volume-bar"
          style={{ width: volume * 100 + "%" }}
        />

        <div className="SoundControlItem--name">
          <span>{source}</span>
          <span>{Math.round(volume * 100)}%</span>
        </div>
      </div>

      <div
        className={classNames("SoundControlItem--action", {
          "SoundControlItem--action--active": !muted,
        })}
        onClick={toggleMute}
      >
        <Icon name={muted ? "volume_off" : "volume_up"} />
      </div>

      <div className="SoundControlItem--action" onClick={toggleHidden}>
        <Icon name={hidden ? "visibility" : "visibility_off"} />
      </div>
    </div>
  );
}

function getPercentX(event: React.PointerEvent | React.MouseEvent) {
  const rect = (event.target as any).getBoundingClientRect();
  const x = event.clientX - rect.left;
  const width = (event.target as HTMLElement).offsetWidth;

  return x / width;
}
