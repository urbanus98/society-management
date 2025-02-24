import LinkButton from "./ui/LinkButton";
import FinanceTable from "./ui/FinanceTable";

interface TableRowData {
  [key: string]: any; // Allows dynamic keys
}
interface Props {
  headers: { key: string; label: string }[];
  rows: TableRowData[];
  linkPart: string;
  title?: string;
  buttonText?: string;
  buttonLink?: string;
}

const UsefulFinanceTable = ({
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
        {title && <h1 className="bright-text margin-right1">{title}</h1>}
        {buttonText && buttonLink && (
          <div className="padding-5">
            <LinkButton text={buttonText} link={buttonLink} />
          </div>
        )}
      </div>
      <div className="mh450 scrollable">
        <FinanceTable headers={headers} rows={rows} linkPart={linkPart} />
      </div>
    </div>
  );
};

export default UsefulFinanceTable;
