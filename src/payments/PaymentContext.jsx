import React, { createContext, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentPopup from "./PaymentReceive";

const stripePromise = loadStripe("pk_test_51QQjvaGke6T8wIec2f9Eq1nhkqRvo4qBC1LGjIpCIekQJwC4VFPAoP7QCNGbAoB99CoJqJ6Iloy5Vy92POOBlwEX00V8Rh8hmK");

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [isPaymentPopupOpen, setPaymentPopupOpen] = useState(false);
  const [selectedCredits, setSelectedCredits] = useState(0);
  const [creditPayment, setCreditPayment] = useState('')

  const createPaymentIntent = async (credits) => {
    const amount = credits * 100; // 1 credit = $1
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/qr/payment/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ id: "credits", amount }] }),
      });
      const data = await response.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setSelectedCredits(credits);
        console.log('see',credits);
        setPaymentPopupOpen(true);
        localStorage.setItem('selectCredit', credits);
      } else {
        console.error("Failed to retrieve clientSecret.");
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };
    
    // Send selected credits to backend when payment is successful
    

    const handlePopupClose = () => {
        const userId = localStorage.getItem('user_id');
        const selectCredit = parseInt(localStorage.getItem('selectCredit'), 10); // Parse the value as a number

        fetch(`${process.env.REACT_APP_BACKEND_URL}/qr/payment/update-credits`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credits: selectCredit, userId }),
        }).then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log("Credits updated successfully", data);
            } else {
              console.error("Failed to update credits");
            }
          });
      };
      const onClosepopup = ()=>{
        setPaymentPopupOpen(false);
      }
      
  return (
    <PaymentContext.Provider value={{ createPaymentIntent , selectedCredits ,setCreditPayment,handlePopupClose}}>
      {children}
      {clientSecret && isPaymentPopupOpen && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentPopup onClose={onClosepopup} creditPayment ={creditPayment}/>
        </Elements>
      )}
    </PaymentContext.Provider>
  );
};
