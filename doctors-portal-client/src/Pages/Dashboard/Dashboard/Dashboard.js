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
      <h2> {user?.displayName} Dashboard comming soooon...</h2>
    </div>
  );
};

export default Dashboard;
