import VersatileTable from "./ui/VersatileTable";
import LinkButton from "./ui/LinkButton";

interface TableRowData {
  [key: string]: any; // Allows dynamic keys
}
interface Props {
  headers: { key: string; label: string }[];
  rows: TableRowData[];
  title?: string;
  buttonText?: string;
  buttonLink?: string;
  linkPart: string;
}

const UsefulTable = ({
  headers,
  rows,
  title,
  buttonText,
  buttonLink,
  linkPart,
}: Props) => {
  return (
    <div>
      <div className="padding-table flex">
        {title && <h1 className="bright-text">{title}</h1>}
        {buttonText && buttonLink && (
          <div className="padding-5 margin-left1">
            <LinkButton text={buttonText} link={buttonLink} />
          </div>
        )}
      </div>
      <div className="mh450 scrollable">
        <VersatileTable headers={headers} rows={rows} linkPart={linkPart} />
      </div>
    </div>
  );
};

export default UsefulTable;
