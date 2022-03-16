import * as React from "react";
import { ethers } from "ethers"

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
];

export default function StickyHeadTable({offers, boughts, id}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  
  let datas = offers.concat(boughts);
  function filterByID(item) {
    if (item.id == id) {
      return true
    }
    return false;
  }
  // datas = datas.filter(filterByID);
  console.log(datas)
  datas = datas.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(b.date) - new Date(a.date);
  });
  return (
    <Paper sx={{ overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>DateTime</TableCell>
            <TableCell align="right">From</TableCell>
            <TableCell align="right">To</TableCell>
            <TableCell align="right">Price</TableCell>
          </TableRow>
        </TableHead>
          <TableBody>
          {datas.map((row) => (
            <TableRow
              key="abcd"
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{row.offeredDateTime ? "Sale": "Buy"}</TableCell>
              <TableCell component="th" scope="row">
                {row.offeredDateTime || row.boughtDateTime }
              </TableCell>
              <TableCell align="right">{row.seller}</TableCell>
              <TableCell align="right">{row.buyer}</TableCell>
              <TableCell align="right">{ethers.utils.formatEther(row.totalPrice)}</TableCell>
            </TableRow>
          ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}