import { Link } from "react-router-dom";

interface Props {
  imagePath: string;
  link: string;
  text: string;
  dark?: boolean;
  alt?: string;
  classes?: string;
}

const ImageLink = ({
  imagePath,
  link,
  text,
  alt,
  classes = "",
  dark = true,
}: Props) => {
  return (
    <div className={"mw100 flex justify-center align-center " + classes}>
      <Link
        to={link}
        className="coluflex align-center justify-center text-center"
      >
        <img src={imagePath} alt={alt} className="width-100" />
        <h6 className={dark ? "bright-text" : "dark-text"}>{text}</h6>
      </Link>
    </div>
  );
};

export default ImageLink;
