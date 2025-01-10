import React, { useContext, useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { PaymentContext } from "./PaymentContext";
import './payment.css'
import axios from "axios";

const PaymentPopup = ({ onClose, creditPayment }) => {
  const { createPaymentIntent, setCreditPayment } = useContext(PaymentContext);
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activated, setActivated] = useState(false);
  const [section, setSection] = useState(false);

  console.log('activated', activated);
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.REACT_APP_FRONTEND_URL}/success`, // Redirect to Thank You page
      },
    });

    if (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };

  const user_id = localStorage.getItem('user_id');
  const getData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user/profile/${user_id}`);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getData();
  }, [])

  const [data, setData] = useState({
    user_phone: '',
    user_city: '',
    user_state: '',
    user_zip: '',
    user_country: '',
    user_fullname: '',
    user_email: '',
    user_id,
  })
  console.log('profile data', data);

  const saveprofileData = async (e) => {
    try {
      if (!data.user_fullname || !data.user_email || !data.user_phone || !data.user_city || !data.user_state || !data.user_zip || !data.user_country) {
        setError('Please fill all the fields');
        setTimeout(() => {
          setError('');
        }, 5000);
        return;
      }
      e.preventDefault();
      const res = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/user/profile`, data);

      console.log(res.data);
      if (res) {
        setSuccess('You can now proceed to payment');
        setActivated(true);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  }
  // Click handler for the disable-layer div
  const handleLayerClick = () => {
    if (!activated) {
      setError('Click on the "Next" button to proceed');

      // Set a timeout to clear the error message after 5 seconds
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };
  return (
    <div className="pop-up-container-wrapper-container">
      <div className="payment-popup">

        <button className="close-popup-btn" style={{zIndex:'99999999'}} onClick={onClose}>X</button>
        <div className="left-side-for-details-payment-data">
          <button className="toogle-btn" onClick={onClose}>{section ? 'Detail' : 'Change Plan'}</button>
            <div className="personal-details-form">
            <h2>Personal Details</h2>
            {/* Full Name */}
            <div className="form-field">
              <label htmlFor="user_fullname">Full Name:</label>
              <input
                onChange={handleChange}
                type="text"
                id="user_fullname"
                name="user_fullname"
                value={data.user_fullname}
                required
              />
            </div>
            <div className="field-group">
              {/* Email Address */}
              <div className="form-field">
                <label htmlFor="user_email">Email Address:</label>
                <input
                  onChange={handleChange}
                  type="email"
                  id="user_email"
                  name="user_email"
                  value={data.user_email}
                  disabled
                />
              </div>

              {/* Phone Number */}
              <div className="form-field">
                <label htmlFor="user_phone">Phone Number:</label>
                <input
                  onChange={handleChange}
                  type="tel"
                  id="user_phone"
                  name="user_phone"
                  value={data.user_phone}
                  required
                />
              </div>

            </div>
            {/* Billing Address */}
            <h2>Address</h2>

            <div className="field-group">
              {/* City */}
              <div className="form-field">
                <label htmlFor="user_city">City:</label>
                <input
                  onChange={handleChange}
                  type="text"
                  id="user_city"
                  name="user_city"
                  value={data.user_city}
                  required
                />
              </div>

              {/* State */}
              <div className="form-field">
                <label htmlFor="user_state">State/Province:</label>
                <input
                  onChange={handleChange}
                  type="text"
                  id="user_state"
                  name="user_state"
                  value={data.user_state}
                  required
                />
              </div>
            </div>
            <div className="field-group">
              {/* ZIP/Postal Code */}
              <div className="form-field">
                <label htmlFor="user_zip">ZIP/Postal Code:</label>
                <input
                  onChange={handleChange}
                  type="text"
                  id="user_zip"
                  name="user_zip"
                  value={data.user_zip}
                  required
                />
              </div>

              {/* Country */}
              <div className="form-field">
                <label htmlFor="user_country">Country:</label>
                <input
                  onChange={handleChange}
                  type="text"
                  id="user_country"
                  name="user_country"
                  value={data.user_country}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button onClick={saveprofileData}>Next</button>
            </div>

            {/* Display error message */}
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            {/* Display error message */}
          </div>
        </div>
        <div className={`disable-layer ${activated ? 'active' : ''}`} onClick={handleLayerClick}>
          <form onSubmit={handlePayment} className="payment-form">
            <div className="payment-summary-payment-popup">
              <h3>Credits: {creditPayment}</h3>
              <h3>Total Payment: ${creditPayment}</h3>
            </div>
            <PaymentElement />
            <button disabled={isLoading || !stripe || !elements}>
              {isLoading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        </div>
      </div>
    </div>

  );
};

export default PaymentPopup;
