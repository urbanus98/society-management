import { Link } from "react-router-dom";

interface Props {
  text: string;
  link: string;
  classes?: string;
}

const LinkButton = ({ text, link, classes }: Props) => {
  return (
    <Link to={link} className={"bright-text " + classes}>
      <button className="btn btn-primary w-10 text-white">{text}</button>
    </Link>
  );
};

export default LinkButton;
