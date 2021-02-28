import { useSources } from "domains/Command/contexts/sources";
import SoundControlItem from "./SoundControlItem";
import "./style.css";

export default function SoundControl() {
  const sources = useSources();

  return (
    <div className="SoundControl">
      {sources.map((source) => (
        <SoundControlItem key={source} source={source} />
      ))}
    </div>
  );
}
