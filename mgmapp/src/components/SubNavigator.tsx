import LinkButton from "./ui/LinkButton";

interface Props {
  left: any;
  right: any;
  disabled?: any;
  title?: string;
  margin?: boolean;
}

const SubNavigator = ({
  left,
  right,
  disabled = false,
  title = "",
  margin = false,
}: Props) => {
  return (
    <div
      className={
        "width-100 flex justify-between " + (margin ? "mar-btm30" : "")
      }
    >
      <LinkButton
        link={left.link}
        text={"< " + left.text}
        color="secondary"
        disabled={!!(disabled & 0b01)}
      />
      <h1 className="bright-text">{title}</h1>
      <LinkButton
        link={right.link}
        text={right.text + " >"}
        color="secondary"
        disabled={!!(disabled & 0b10)}
      />
    </div>
  );
};

export default SubNavigator;
