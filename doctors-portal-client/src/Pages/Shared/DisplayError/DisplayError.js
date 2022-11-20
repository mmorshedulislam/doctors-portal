import React from "react";
import { useRouteError } from "react-router-dom";

const DisplayError = () => {
  const error = useRouteError();
  return (
    <div className="h-screen flex items-center justify-center text-center">
      <div>
      <h2 className="text-5xl">Something went wrong!</h2>
      <p className="text-3xl">{error.status || error.message}</p>
      </div>
    </div>
  );
};

export default DisplayError;
