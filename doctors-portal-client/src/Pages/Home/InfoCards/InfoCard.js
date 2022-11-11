import React from "react";

const InfoCard = ({ card }) => {
  return (
    <div className={`card md:card-side shadow-xl text-white p-6 ${card.bgClass}`}>
      <figure>
        <img src={card.icon} alt="Movie" />
      </figure>
      <div className="card-body text-center md:text-left">
        <h2 className="text-2xl font-bold">{card.name}</h2>
        <p>{card.description}</p>
      </div>
    </div>
  );
};

export default InfoCard;
