interface Props {
  text?: string;
  margin?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const SubmButton = ({
  text = "Potrdi",
  margin = "",
  disabled = false,
  onClick,
}: Props) => {
  return (
    <div className={"justify-center flex margin-tb" + margin}>
      <button
        type="submit"
        className="btn btn-primary width-50"
        disabled={disabled}
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default SubmButton;
