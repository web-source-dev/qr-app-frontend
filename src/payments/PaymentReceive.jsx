import React, { useContext, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { PaymentContext } from "./PaymentContext";

const PaymentPopup = ({ onClose,creditPayment }) => {
  const { createPaymentIntent,setCreditPayment } = useContext(PaymentContext);
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/success", // Redirect to Thank You page
      },
    });

    if (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };
  const handleCreditClick = (credits) => {
    createPaymentIntent(credits);
    setCreditPayment(credits);  // This will set the credit payment amount globally across the app.  // You can use this in your other components where you need to access the credit payment amount.  // For example, in a checkout page, you can display the credit payment amount.  // This can be done in a separate component or in the PaymentContext component.  // This is just a simple example.  // You can also use Redux, MobX, or any other state
    console.log(credits);
  };


  return (
    <div className="pop-up-container-wrapper-container">
          <div className="payment-popup">

<button className="close-popup-btn" onClick={onClose}>X</button>
    <div className="left-side-for-showing-payment-data">
      <div className="logo-section-payment-pop-up">
        <img src="https://res.cloudinary.com/dcvqytwuq/image/upload/v1733500935/vugjqfnwsu9cj3zib0cs.png" alt="Logo" className="logo-of-payment-pop-up" />
        <div className="name-of-payment-popup">
        <h2>Qr Code Generater</h2>
        <p>Scan and download your QR code and save it for future use.</p>
        </div>
      </div>
     <h3> Change Your Plan if you want</h3>
      <div className="credit-selections-box">
        <div className="credit-box-payment-popup" onClick={() => handleCreditClick(100)}>
          <h3>100 Credits</h3>
          <p>$100</p>
        </div>
        <div className="credit-box-payment-popup" onClick={() => handleCreditClick(200)}>
          <h3>200 Credits</h3>
          <p>$200</p>
        </div>
        <div className="credit-box-payment-popup" onClick={() => handleCreditClick(300)}>
          <h3>300 Credits</h3>
          <p>$300</p>
        </div>
      </div>
      <div className="credit-summary-payment-popup">
        <p>Selected Credits: {creditPayment}</p>
        <p>Total Payment: ${creditPayment}</p>
      </div>
    </div>
    <form onSubmit={handlePayment} className="payment-form">
      <PaymentElement />
      <button disabled={isLoading || !stripe || !elements}>
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  </div>
    </div>
  
  );
};

export default PaymentPopup;
