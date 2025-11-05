interface Props {
  text?: string;
  margin?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const DeleteButton = ({
  text = "Izbriši",
  margin = "",
  disabled = false,
  onClick,
}: Props) => {
  return (
    <div className={"justify-center flex margin-tb" + margin}>
      <button
        type="button"
        className="btn btn-danger width-50"
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default DeleteButton;
