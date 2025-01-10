import React, { useContext } from "react";
import { PaymentContext } from "./PaymentContext";

const CreditsSelection = () => {
  const { createPaymentIntent,setCreditPayment } = useContext(PaymentContext);

  const handleCreditClick = (credits) => {
    createPaymentIntent(credits);
    setCreditPayment(credits); 
    console.log(credits);
  };


  return (
  <>
    <h3> Select Your Plan</h3>
    <div className="personal-details-form-select">
    <div className="credit-box-payment-popup" onClick={() => handleCreditClick(100)}>
      <h3>100 Credits - <span className="text-align-right">$100</span></h3>
      <ul>
        <li>Generate up to 100 QR codes</li>
        <li>Access to basic QR customization options (color, size)</li>
        <li>Download QR codes in standard quality (PNG, JPG)</li>
        <li>QR code tracking for basic analytics</li>
      </ul>
    </div>

    <div className="credit-box-payment-popup" onClick={() => handleCreditClick(200)}>
      <h3>200 Credits - <span className="text-align-right">$200</span></h3>
      <ul>
          <li>Generate up to 250 QR codes</li>
          <li>Advanced QR customization options (colors, gradients, shape changes)</li>
          <li>Download QR codes in high quality (PNG, JPG, SVG)</li>
          <li>QR code tracking with advanced analytics (scans, locations)</li>
          <li>Priority email support for customization issues</li>
          <li>QR code bulk generation for large batches</li>
      </ul>
    </div>

    <div className="credit-box-payment-popup" onClick={() => handleCreditClick(300)}>
      <h3>300 Credits - <span className="text-align-right">$300</span></h3>
      <ul>
        <li>Generate unlimited QR codes</li>
        <li>Access to premium QR customization options (logos, frames, QR shapes, animation effects)</li>
        <li>High-resolution downloads (print-ready PDFs, EPS)</li>
        <li>Exclusive access to new QR features and beta tools</li>
        <li>QR code tracking with detailed analytics (conversion rates, scan demographics)</li>
        <li>24/7 dedicated customer support (chat, email, and phone)</li>
      </ul>
    </div>
  </div>
  </>
  );
};

export default CreditsSelection;
