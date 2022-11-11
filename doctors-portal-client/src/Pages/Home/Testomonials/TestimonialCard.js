import React from "react";

const TestimonialCard = ({ testimonial }) => {
  const { name, people, location, description } = testimonial;
  return (
    <div className="border rounded-lg p-6">
      <p>{description}</p>
      <div className="flex items-center gap-x-3 my-5">
        <img
          src={people}
          className="w-12 rounded-full border-2 border-primary"
          alt=""
        />
        <div>
          <h3>{name}</h3>
          <h4>{location}</h4>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
