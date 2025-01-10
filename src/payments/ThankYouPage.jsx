import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentContext } from "./PaymentContext";

const ThankYouPage = () => {
  const { handlePopupClose, selectedCredits } = useContext(PaymentContext);
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentError, setPaymentError] = useState(null);
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    const sendThankYouEmail = async () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const paymentIntent = queryParams.get('payment_intent');
        const paymentStatus = queryParams.get('redirect_status');

        // Check if the payment was successful
        if (paymentIntent && paymentStatus === 'succeeded') {
          // Fetch payment data from backend or Stripe API
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/qr/payment/store-payment-data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntent, user_id }),
          });

          const data = await response.json();
          if (data.success) {
            handlePopupClose();
            setPaymentDetails(data.paymentDetails);
            sessionStorage.setItem("paymentProcessed", "true");
            console.log('data',data.paymentDetails);
            await sendEmail(data.paymentDetails);
          }} else if(paymentIntent && paymentStatus === 'failed'){
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/qr/payment/store-payment-data`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentIntent, user_id }),
            });
            const data = await response.json();
          if (data.success) {
            setPaymentDetails(data.paymentDetails);
            console.log('data',data.paymentDetails);
            await sendEmail(data.paymentDetails);
          }
            setPaymentError("Unable to fetch payment details.");
          }else {
          
          setPaymentError("Payment failed or was not successful.");
        }
      } catch (error) {
        console.error("Error sending thank you email:", error);
        setPaymentError("Something went wrong while processing your payment.");
      } finally {
        setLoading(false);
      }
    };

    sendThankYouEmail();

    // Redirect to the dashboard after 10 seconds
    const startPaymentTimeout = () => {
      const paymentStartTime = sessionStorage.getItem("paymentStartTime");
      const currentTime = Date.now();

      if (paymentStartTime) {
        // Calculate elapsed time
        const elapsedTime = currentTime - parseInt(paymentStartTime, 10);
        const remainingTime = 123000 - elapsedTime; // 10 seconds minus elapsed time

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
        setTimeout(() => handlePaymentTimeout(), 123000);
      }
    };

    const handlePaymentTimeout = () => {
      // Clear the payment start time
      sessionStorage.removeItem("paymentStartTime");
      sessionStorage.removeItem("paymentProcessed");

      if (localStorage.getItem("currentPath")) {
        localStorage.removeItem("selectCredit");
        localStorage.removeItem("pricing");
        navigate("/dashboard/managepayment");
        return;
      }
      localStorage.removeItem("selectCredit");
      navigate("/dashboard/managepayment");
    };

    // Call the function when the page loads
    startPaymentTimeout();

  }, [handlePopupClose, selectedCredits, navigate]);

  const sendEmail = async (paymentDetails) => {
    const userEmail = localStorage.getItem('user_email');
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/qr/payment/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          credits: paymentDetails.amount / 100, // Assuming amount is in cents
          paymentDetails,
        }),
      });
      console.log('Thank you email sent successfully');
    } catch (error) {
      console.error('Error sending thank you email:', error);
    }
  };

  const handleReturn = () => {
    sessionStorage.removeItem("paymentProcessed");
    navigate('/dashboard/payments');
  };

  return (
    <div className="thank-you-page">
      {loading ? (
        <div>Loading payment details...</div>
      ) : paymentError ? (
        <div className="error-message">{paymentError}</div>
      ) : (
        <div>
          <h3>Thank you for your purchase!</h3>
          <p>Your payment was successful, and your credits have been updated.</p>
          <p>Credits Purchased: {paymentDetails ? paymentDetails.amount / 100 : "Loading..."}</p>
          <p>Payment Method: {paymentDetails ? paymentDetails.payment_method : "Loading..."}</p>
          <p>Payment Status: {paymentDetails ? paymentDetails.status : "Loading..."}</p>
          <button onClick={handleReturn}>Go to Home</button>
        </div>
      )}
    </div>
  );
};

export default ThankYouPage;
