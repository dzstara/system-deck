import classNames from "classnames";
import { useSource } from "domains/Command/hooks/source";
import Icon from "components/Icon";

const microphoneSourceName = process.env.REACT_APP_MICROPHONE_SOURCE_NAME ?? "";

export default function QuickMute() {
  const microphone = useSource(microphoneSourceName);

  return (
    <div
      className={classNames("Quick--item", "QuickMute", {
        "Quick--item--active": microphone.muted,
      })}
      onClick={microphone.toggleMute}
    >
      <Icon name="mic_off" />
    </div>
  );
}
