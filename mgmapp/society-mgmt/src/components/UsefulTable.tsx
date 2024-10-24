import { Link } from "react-router-dom";
import VersatileTable from "./ui/VersatileTable";

interface Props {
  headers: string[];
  rows: any[];
  title: string;
  buttonText: string;
  buttonLink: string;
  linkIndex: number;
  linkPart: string;
}

const UsefulTable = ({
  headers,
  rows,
  title,
  buttonText,
  buttonLink,
  linkIndex,
  linkPart,
}: Props) => {
  return (
    <>
      <div className="padding-table flex">
        <h1 className="bright-text">{title}</h1>
        <div className="padding-5 margin-left1">
          <button className="btn btn-primary w-10 text-white">
            <Link to={buttonLink} className="bright-text">
              {buttonText}
            </Link>
          </button>
        </div>
      </div>
      <VersatileTable
        headers={headers}
        rows={rows}
        linkIndex={linkIndex}
        linkPart={linkPart}
      />
    </>
  );
};

export default UsefulTable;
