interface Props {
  text?: string;
  margin?: string;
  onClick?: () => void;
}

const SubmButton = ({ text = "Potrdi", margin = "", onClick }: Props) => {
  return (
    <div className={"justify-center flex margin-tb" + margin}>
      <button
        type="submit"
        className="btn btn-primary width-50"
        onClick={onClick}
      >
        {text}
      </button>
    </div>
  );
};

export default SubmButton;
