import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClose?: () => void;
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

const Alert = ({ children, onClose, color = "primary" }: Props) => {
  return (
    <div className={"alert alert-dismissible alert-" + color}>
      {children}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default Alert;
