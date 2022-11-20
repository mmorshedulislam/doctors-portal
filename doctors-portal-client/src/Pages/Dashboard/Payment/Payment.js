import React from "react";
import { useLoaderData, useNavigation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import Loading from "../../Shared/Loading";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK);
// REACT_APP_STRIPE_PK=pk_test_6pRNASCoBOKtIshFeQd4XMUh


const Payment = () => {
  const booking = useLoaderData();
  const { treatment, price, appointmentDate, slot } = booking;
  const navigation = useNavigation();

  if (navigation.state === "loading") {
    return <Loading></Loading>;
  }

  return (
    <div>
      <h2 className="text-3xl mb-5">Payment for {treatment}</h2>
      <p>
        Please pay <strong className="text-primary">${price}</strong> for your
        appointment on {appointmentDate} at {slot}
      </p>
      <div className="w-96 my-10">
        <Elements stripe={stripePromise}>
          <CheckoutForm booking={booking} />
        </Elements>
      </div>
    </div>
  );
};

export default Payment;
