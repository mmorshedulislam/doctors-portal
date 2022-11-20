import React from "react";
import { Link } from "react-router-dom";

const TableRow = ({ book, i }) => {
  const { _id, patientName, treatment, appointmentDate, slot, price } = book;
  console.log(book);
  return (
    <tr>
      <th>{i + 1}</th>
      <td>{patientName}</td>
      <td>{treatment}</td>
      <td>{appointmentDate}</td>
      <td>{slot}</td>
      <td>{price && '$'}{price}</td>
      <td>
        {book.price && !book.paid && (
          <Link to={`/dashboard/payment/${_id}`}><button className="text-white btn btn-sm btn-primary"> Pay</button></Link>
        )}
        {book.price && book.paid && <span className="text-green-500">Paid</span>}
      </td>
    </tr>
  );
};

export default TableRow;
