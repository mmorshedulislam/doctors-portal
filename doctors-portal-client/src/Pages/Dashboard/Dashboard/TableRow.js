import React from "react";

const TableRow = ({ book, i }) => {
  const { _id, patientName, treatment, appointmentDate, slot } = book;
  console.log(book);
  return (
    <tr>
      <th>{i + 1}</th>
      <td>{patientName}</td>
      <td>{treatment}</td>
      <td>{appointmentDate}</td>
      <td>{slot}</td>
    </tr>
  );
};

export default TableRow;
