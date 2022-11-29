import React from "react";
import appointment from "../../../assets/images/appointment.png";

const ContactUs = () => {
  return (
    <section className="py-32" style={{ background: `url(${appointment})` }}>
      <div>
        <div className="mb-10 text-center">
          <h5 className="text-xl text-primary font-bold">Contact Us</h5>
          <h2 className="text-3xl lg:text-4xl text-white">
            Stay connected with us
          </h2>
        </div>
      </div>
      <form className="lg:w-1/3 mx-5 lg:mx-auto">
        <input
          type="text"
          placeholder="Email Address"
          className="input input-bordered input-md w-full"
        />
        <input
          type="text"
          placeholder="Subject"
          className="input input-bordered input-md w-full my-3"
        />
        <textarea
          className="textarea w-full h-24"
          placeholder="Your Message..."
        ></textarea>
      </form>
    </section>
  );
};

export default ContactUs;
