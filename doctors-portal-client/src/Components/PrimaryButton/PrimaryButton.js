import React from "react";

const PrimaryButton = ({ children }) => {
  return (
    <button className="btn bg-gradient-to-r from-primary to-secondary text-white">
      {children || 'Get Started'}
    </button>
  );
};

export default PrimaryButton;
