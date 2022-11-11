import React from "react";
import Chair from "../../../assets/images/chair.png";
import "../Banner/Banner.css";

const Banner = () => {
  return (
    <div className="hero bg-banner lg:mx-5 lg:py-20">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img
          src={Chair}
          className="rounded-lg shadow-2xl lg:w-2/4"
          alt=""
        />
        <div className="lg:w-2/4">
          <h1 className="text-5xl font-bold">Your New Smile Starts Here</h1>
          <p className="py-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the
          </p>
          <button className="btn bg-gradient-to-r from-primary to-secondary text-white">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
