import FuncButton from "./ui/FuncButton";
import LinkButton from "./ui/LinkButton";

interface Props {
  text: any;
  right: any;
  title?: string;
  margin?: boolean;
  onClick: () => void;
}

const SpecializedNav = ({
  text,
  right,
  title = "",
  margin = false,
  onClick,
}: Props) => {
  return (
    <div
      className={
        "width-100 flex justify-between " + (margin ? "mar-btm30" : "")
      }
    >
      <FuncButton label={text} color="secondary" onClick={onClick} />
      <h1 className="bright-text">{title}</h1>
      <LinkButton
        link={right.link}
        text={right.text + " >"}
        color="secondary"
      />
    </div>
  );
};

export default SpecializedNav;
