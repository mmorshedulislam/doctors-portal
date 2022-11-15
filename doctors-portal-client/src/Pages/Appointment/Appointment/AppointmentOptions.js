import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import AppointmentOption from "./AppointmentOption";
import BookingModal from "./BookingModal";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

const AppointmentOptions = ({ selectedDate }) => {
  const [treatment, setTreatment] = useState(null);
  const date = format(selectedDate, 'PP')
  // using normal fetch
  const { data: appointmentOptions = [] } = useQuery({
    queryKey: ["appointmentOptions", date],
    queryFn: () =>
      fetch(`http://localhost:5000/appointmentOptions?date=${date}`).then((res) =>
        res.json()
      ),
  });

  // using async await
/*   const {data: appointmentOptions = []} = useQuery({
    queryKey: ['appointmentOptions'],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/appointmentOptions`); 
      const data = res.json()
      return data; 
    }
  }) */


  // using useEffect 
  /*   const [appointmentOptions, setAppointmentOptions] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:5000/appointmentOptions`)
      .then((res) => res.json())
      .then((data) => setAppointmentOptions(data));
  }, []); */

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-16 gap-6">
        {appointmentOptions.map((option) => (
          <AppointmentOption
            key={option._id}
            appointmentOption={option}
            setTreatment={setTreatment}
          ></AppointmentOption>
        ))}
      </div>
      {treatment && (
        <BookingModal
          treatment={treatment}
          setTreatment={setTreatment}
          selectedDate={selectedDate}
        ></BookingModal>
      )}
    </section>
  );
};

export default AppointmentOptions;
