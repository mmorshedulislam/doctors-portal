import React from "react";
import Loading from "../../Shared/Loading";
import TableRow from "./TableRow";

const MyAppointments = ({ bookings, isLoading }) => {
  if (isLoading) {
    return <Loading></Loading>;
  }
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
          {bookings &&
            bookings?.map((book, i) => (
              <TableRow key={i} book={book} i={i}></TableRow>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyAppointments;
