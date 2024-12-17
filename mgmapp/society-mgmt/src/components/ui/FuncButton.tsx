interface Props {
  children: any;
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
      {children}
    </button>
  );
};

export default FuncButton;
