import React from "react";
import TestimonialCard from "./TestimonialCard";
import people1 from "../../../assets/images/people1.png";
import people2 from "../../../assets/images/people2.png";
import people3 from "../../../assets/images/people3.png";
import quote from "../../../assets/icons/quote.svg";

const Testimonials = () => {
  const TestimonialData = [
    {
      id: 1,
      people: people1,
      name: "Winson Herry",
      location: "California",
      description:
        "It is a long established fact that by the readable content of a lot layout. The point of using Lorem a more-or-less normal distribu to using Content here, content",
    },
    {
      id: 2,
      people: people2,
      name: "Winson Herry",
      location: "California",
      description:
        "It is a long established fact that by the readable content of a lot layout. The point of using Lorem a more-or-less normal distribu to using Content here, content",
    },
    {
      id: 3,
      people: people3,
      name: "Winson Herry",
      location: "California",
      description:
        "It is a long established fact that by the readable content of a lot layout. The point of using Lorem a more-or-less normal distribu to using Content here, content",
    },
  ];
  return (
    <div className="my-20">
      <div className="flex justify-between items-center my-10">
        <div className="mb-10">
          <h5 className="text-xl text-primary font-bold">Testimonial</h5>
          <h2 className="text-accent  text-3xl lg:text-4xl">What Our Patients Says</h2>
        </div>
        <div>
          <img src={quote} className="w-24 lg:w-48" alt="" />
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {TestimonialData.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
          ></TestimonialCard>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
