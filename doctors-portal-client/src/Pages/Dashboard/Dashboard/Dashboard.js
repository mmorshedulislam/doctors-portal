import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import Navbar from "../../Shared/Navbar/Navbar";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div>
      <Navbar></Navbar>
      <div className="grid grid-cols-[1fr_3fr] gap-5">
        <div className="bg-red-200">Div 1</div>
        <div className="bg-red-200">Div 2</div>
      </div>
    </div>
  );
};

export default Dashboard;
