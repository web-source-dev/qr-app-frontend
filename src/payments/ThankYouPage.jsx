import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentContext } from "./PaymentContext";

const ThankYouPage = () => {
  const { handlePopupClose ,selectedCredits} = useContext(PaymentContext);
  const navigate = useNavigate();
  const [selectedCred,setSclectedCred] = useState()
  
  
  useEffect(() => {
    setSclectedCred(localStorage.getItem('selectCredit'))
    const sendThankYouEmail = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const paymentIntent = queryParams.get('payment_intent');
        const paymentStatus = queryParams.get('redirect_status');
  
        // Check if the payment was successful
        if (paymentIntent && paymentStatus === 'succeeded') {
          // Close the popup and update credits
          handlePopupClose();
  
          // Mark the payment as processed
          sessionStorage.setItem("paymentProcessed", "true");
          const user_email = localStorage.getItem('user_email')
  
          // Send the email
          await fetch(`${process.env.REACT_APP_BACKEND_URL}/qr/payment/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user_email, // Replace with the actual user's email
              credits: selectedCredits, // Include credits in the email
            }),
          });
  
          console.log('Thank you email sent successfully');
        }
      } catch (error) {
        console.error('Error sending thank you email:', error);
      }
    };
  
    // Check if this action should run
    const paymentProcessed = sessionStorage.getItem("paymentProcessed");
    if (paymentProcessed !== "true") {
      sendThankYouEmail();
    }
  
    // Redirect to the dashboard after 10 seconds
    const startPaymentTimeout = () => {
      const paymentStartTime = sessionStorage.getItem("paymentStartTime");
      const currentTime = Date.now();
    
      if (paymentStartTime) {
        // Calculate elapsed time
        const elapsedTime = currentTime - parseInt(paymentStartTime, 10);
        const remainingTime = 10000 - elapsedTime; // 10 seconds minus elapsed time
    
        if (remainingTime > 0) {
          // If there is still time left, set a timeout for the remaining time
          setTimeout(() => handlePaymentTimeout(), remainingTime);
        } else {
          // If time has already elapsed, execute immediately
          handlePaymentTimeout();
        }
      } else {
        // If no start time exists, set it now and start the timeout
        sessionStorage.setItem("paymentStartTime", currentTime.toString());
        setTimeout(() => handlePaymentTimeout(), 10000);
      }
    };
    
    const handlePaymentTimeout = () => {
      // Clear the payment start time
      sessionStorage.removeItem("paymentStartTime");
      sessionStorage.removeItem("paymentProcessed");
    
      if (localStorage.getItem("currentPath")) {
        localStorage.removeItem("selectCredit");
        localStorage.removeItem("pricing")
        navigate("/sidebar");
        return;
      }
      localStorage.removeItem("selectCredit");
      navigate("/sidebar");
    };
    
    // Call the function when the page loads
    startPaymentTimeout();
    
  }, [handlePopupClose, selectedCredits, navigate]);
  
  const handleReturn = () => {
    sessionStorage.removeItem("paymentProcessed")
    navigate('/sidebar')
  };

  return (
    <div className="thank-you-page">
      <h3>Thank you for your purchase!</h3>
      <p>Your payment was successful, and your credits have been updated.</p>
      <p>Credits Purchased: {selectedCred} Credits</p> {/* Optionally show the selected credits */}
      <button onClick={handleReturn}>Go to Home</button>
    </div>
  );
};

export default ThankYouPage;
