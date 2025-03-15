interface Props {
  children?: any;
  label?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
}

const FuncButton = ({
  children,
  label = "",
  color = "primary",
  isDisabled = false,
  onClick,
}: Props) => {
  return (
    <button
      type="button"
      className={"btn btn-" + color}
      disabled={isDisabled}
      onClick={onClick}
    >
      {label}
      {children}
    </button>
  );
};

export default FuncButton;
