import React, { useContext } from "react";
import { PaymentContext } from "./PaymentContext";

const CreditsSelection = () => {
  const { createPaymentIntent,setCreditPayment } = useContext(PaymentContext);

  const handleCreditClick = (credits) => {
    createPaymentIntent(credits);
    setCreditPayment(credits);  // This will set the credit payment amount globally across the app.  // You can use this in your other components where you need to access the credit payment amount.  // For example, in a checkout page, you can display the credit payment amount.  // This can be done in a separate component or in the PaymentContext component.  // This is just a simple example.  // You can also use Redux, MobX, or any other state
    console.log(credits);
  };


  return (
    <div className="credits-container">
      <div className="credit-box" onClick={() => handleCreditClick(100)}>
        <h3>100 Credits</h3>
        <p>$100</p>
      </div>
      <div className="credit-box" onClick={() => handleCreditClick(200)}>
        <h3>200 Credits</h3>
        <p>$200</p>
      </div>
      <div className="credit-box" onClick={() => handleCreditClick(300)}>
        <h3>300 Credits</h3>
        <p>$300</p>
      </div>
    </div>
  );
};

export default CreditsSelection;
