import Icon from "components/Icon";
import { PropsWithChildren } from "react";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";

interface AlertProps {
  icon: string;
  content: ({ Highlight }: { Highlight: React.FC }) => React.ReactNode;
}

export default function Alert(props: AlertProps) {
  return (
    <div className="Alert">
      <div className="Alert--icon">
        <Icon name={props.icon} mode="sharp" />
      </div>
      <div className="Alert--text">
        <div>{props.content({ Highlight: AlertHighlight })}</div>
      </div>
    </div>
  );
}

function AlertHighlight(props: PropsWithChildren<{}>) {
  return <span className="Alert--highlight" children={props.children} />;
}
