import React from "react";
import InfoCard from "./InfoCard";
import clock from "../../../assets/icons/clock.svg";
import marker from "../../../assets/icons/marker.svg";
import phone from "../../../assets/icons/phone.svg";

const InfoCards = () => {
  const cardData = [
    {
      id: 1,
      name: "Opening Hour",
      description: "Opening at 09 am to 05 pm.",
      icon: clock,
      bgClass: "bg-primary",
    },
    {
      id: 2,
      name: "Our Locations",
      description: "Opening at 09 am to 05 pm.",
      icon: marker,
      bgClass: "bg-accent",
    },
    {
      id: 3,
      name: "Contact Now",
      description: "Opening at 09 am to 05 pm.",
      icon: clock,
      bgClass: "bg-primary",
    },
  ];
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 my-6">
      {cardData.map((card) => (
        <InfoCard key={card.id} card={card}></InfoCard>
      ))}
    </div>
  );
};

export default InfoCards;
