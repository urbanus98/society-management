import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import Button from "./FuncButton";
import { string } from "yup";

// Define the table component
export default function VersatileTable({
  headers,
  rows,
  linkIndex,
  linkPart,
}: {
  headers: any[];
  rows: any[];
  linkIndex?: number;
  linkPart: string;
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 320 }} aria-label="simple table">
        {/* Table Header */}
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {/* Table Body */}
        <TableBody>
          {rows.map((row, index) => (
            <TableRow hover key={index}>
              {row.map((cell: any, cellIndex: number) => (
                <TableCell key={cellIndex}>
                  {cellIndex === linkIndex ? (
                    <Link to={`/${linkPart}/${cell}/edit`}>
                      <img src="images/edit_bs.png" alt="edit" width={20} />
                    </Link>
                  ) : (
                    cell
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
