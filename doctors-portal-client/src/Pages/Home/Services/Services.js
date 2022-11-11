import React from "react";
import ServiceCard from "./ServiceCard";
import cavity from "../../../assets/images/cavity.png";
import fluoride from "../../../assets/images/fluoride.png";
import whitening from "../../../assets/images/whitening.png";

const Services = () => {
  const serviceData = [
    {
      id: 1,
      name: "Fluoride Treatment",
      description:
        "Lorem Ipsum is simply dummy printing and typesetting indust Ipsum has been the",
      icon: fluoride,
    },
    {
      id: 2,
      name: "Cavity Filling",
      description:
        "Lorem Ipsum is simply dummy printing and typesetting indust Ipsum has been the",
      icon: cavity,
    },
    {
      id: 3,
      name: "Teeth Whitening",
      description:
        "Lorem Ipsum is simply dummy printing and typesetting indust Ipsum has been the",
      icon: whitening,
    },
  ];
  return (
    <div className="my-10">
      <div className="text-center my-4">
        <h5 className="text-xl text-primary font-bold">Our Services</h5>
        <h2 className="text-accent text-5xl">Services we Provide</h2>
      </div>
      <div className="grid gap-10 mt-10 md:grid-cols-2 lg:grid-cols-3">
        {serviceData.map((card) => (
          <ServiceCard key={card.id} card={card}></ServiceCard>
        ))}
      </div>
    </div>
  );
};

export default Services;
