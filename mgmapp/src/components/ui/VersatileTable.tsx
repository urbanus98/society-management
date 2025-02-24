import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import editIcon from "../../assets/icons/edit_bs.png";

interface TableRowData {
  [key: string]: any; // Allows dynamic keys
}

export default function VersatileTable({
  headers,
  rows,
  linkPart,
}: {
  headers: { key: string; label: string }[];
  rows: TableRowData[];
  linkPart: string;
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 320 }} aria-label="finance table">
        {/* Table Header */}
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header.key}>{header.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {/* Table Body */}
        <TableBody>
          {rows.map((row, index) => (
            <TableRow hover key={index}>
              {headers.map((header) => (
                <TableCell key={`${index}-${header.key}`}>
                  {header.key === "id" ? ( // If this column is a link
                    <Link to={`/${linkPart}/${row["id"]}/edit`}>
                      <img src={editIcon} alt="edit" width={20} />
                    </Link>
                  ) : (
                    row[header.key]
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
