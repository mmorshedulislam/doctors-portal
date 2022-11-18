import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { DayPicker } from "react-day-picker";
import { AuthContext } from "../../../contexts/AuthProvider";
import Navbar from "../../Shared/Navbar/Navbar";
import DashboardTable from "./DashboardTable";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const date = format(selectedDate, "PP");

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings", date, user.email],
    queryFn: () =>
      fetch(
        `http://localhost:5000/bookings?email=${user?.email}&date=${date}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      ).then((res) => res.json()),
  });

  return (
    <div>
      <div className="">
        <div className="bg-[#F1F5F9] p-10 rounded-xl">
          <div className="flex justify-between items-center my-3">
            <h2 className="text-2xl my-3">My Appointment</h2>
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="border-2 border-black rounded-md p-3 font-semibold"
              >
                {format(selectedDate, "PP")}
              </button>
              <div
                className={`absolute right-0 top-14 z-10 bg-white text-black border-2 border-black rounded-xl ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </div>
            </div>
          </div>
          <DashboardTable bookings={bookings}></DashboardTable>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
