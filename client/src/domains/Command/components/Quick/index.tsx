import QuickAFK from "./QuickAFK";
import QuickMute from "./QuickMute";
import "./style.css";

export default function Quick() {
  return (
    <div className="Quick">
      <QuickMute />
      <QuickAFK />
    </div>
  );
}
