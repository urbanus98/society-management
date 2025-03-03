import { useNavigate } from "react-router-dom";
import BackIcon from "./BackIcon";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(-1)}>
      <BackIcon color="#f1f5f8" size={45} />
    </div>
  );
};

export default BackButton;
