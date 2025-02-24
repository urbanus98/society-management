import { Link } from "react-router-dom";

interface Props {
  text: string;
  link: string;
  classes?: string;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  disabled?: boolean;
}

const LinkButton = ({
  text,
  link,
  classes,
  color = "primary",
  disabled = false,
}: Props) => {
  return (
    <Link to={link} className={"bright-text " + classes}>
      <button
        className={"btn btn-" + color + " w-10 text-white"}
        disabled={disabled}
      >
        {text}
      </button>
    </Link>
  );
};

export default LinkButton;
