import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@material-ui/core";

const columns = [
  { id: "event", label: "Event", minWidth: 170, align:"center",},
  {
    id: "price",
    label: "Price",
    minWidth: 100,
    format: (value) => parseFloat(value),
    align:"center",
  },
  {
    id: "from",
    label: "From",
    minWidth: 170,
    align: "center",
  },
  {
    id: "to",
    label: "To",
    minWidth: 170,
    align: "center",
  },
  {
    id: "date",
    label: "Date",
    minWidth: 170,
    align: "center",
  },
];

function createData(event, price, from, to) {
  const date = Date().toLocaleString();
  return { event, price, from, to, date };
}

const rows = [
  createData("Sale", "1000", "User", "user1"),
  createData("Transfer", "1000", "user1", "user2"),
  createData("Transfer", "1000", "user1", "user2"),
  createData("Transfer", "100", "user1", "user2"),
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  return (
    <Paper sx={{ overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}