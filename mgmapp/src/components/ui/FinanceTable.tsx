import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import editIcon from "../../assets/icons/edit_bs.png";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface TableRowData {
  [key: string]: any; // Allows dynamic keys
}
interface Header {
  key: string;
  label: string;
  hideOnMobile?: boolean;
}
interface Props {
  headers: Header[];
  rows: TableRowData[];
  linkPart: string;
}

export default function FinanceTable({ headers, rows, linkPart }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const visibleHeaders = isMobile
    ? headers.filter((header) => !header.hideOnMobile)
    : headers;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 320 }} aria-label="finance table">
        {/* Table Header */}
        <TableHead>
          <TableRow>
            {visibleHeaders.map((header) => (
              <TableCell key={header.key}>{header.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {/* Table Body */}
        <TableBody>
          {rows.map((row, index) => (
            <TableRow hover key={index}>
              {visibleHeaders.map((header) => (
                <TableCell key={`${index}-${header.key}`}>
                  {header.key === "id" ? ( // If this column is a link
                  !row.isSale && row["id"] && ( // hide on sales and trip costs
                    <Link to={`/${linkPart}/${row["id"]}/edit`}>
                      <img src={editIcon} alt="edit" width={20} />
                    </Link>
                    )
                  ) : (
                    <>
                      {row["direction"] === 1 ? ( // If outflow
                        <div className="">
                          {header.key === "amount" ? "-" : ""}
                          {row[header.key]}
                        </div>
                      ) : (
                        <div className="green-text">
                          {header.key === "amount" ? "\u00A0" : ""}
                          {row[header.key]}
                        </div>
                      )}
                    </>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
