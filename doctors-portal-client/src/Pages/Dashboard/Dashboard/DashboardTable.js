import React from "react";
import TableRow from "./TableRow";

const DashboardTable = ({ bookings: bookings }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* <!-- head --> */}
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Treatment</th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {bookings?.map((book, i) => (
            <TableRow
              key={i}
              book={book}
              i={i}
            ></TableRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTable;
