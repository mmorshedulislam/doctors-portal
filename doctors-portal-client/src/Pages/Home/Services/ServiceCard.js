import React from "react";

const ServiceCard = ({ card }) => {
  const { name, description, icon } = card;
  return (
    <div className="card card-compact p-5 shadow-xl">
      <figure>
        <img src={icon} alt="Shoes" />
      </figure>
      <div className="card-body text-center">
        <h2 className="text-2xl font-bold text-center">{name}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
