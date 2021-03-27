import classNames from "classnames";
import "./style.css";

export default function Icon({
  name,
  mode = "filled",
}: {
  name: string;
  mode?: "filled" | "outlined" | "rounded" | "sharp";
}) {
  return <i className={classNames("Icon", "material-icons")}>{name}</i>;
}
