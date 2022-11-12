import { format } from "date-fns";
import React from "react";
import AppointmentOptions from "./AppointmentOptions";

const AvailableAppointment = ({ selectedDate }) => {
  return (
    <div className="mt-10">
      <p className="text-center text-secondary font-bold">
        Available Appointments on {format(selectedDate, "PP")}
      </p>
      <AppointmentOptions selectedDate={selectedDate}></AppointmentOptions>
    </div>
  );
};

export default AvailableAppointment;
