import React, { useState, useEffect } from 'react';
import './ManagePayment.css'; // Import CSS for styling

const ManagePayment = () => {
    const userId = localStorage.getItem('user_id');
    const [userDetails, setUserDetails] = useState(null);
    const [payments, setPayments] = useState([]);
    const [creditDetails, setCreditDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/qr/payment/user/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                console.log('data', data);

                setUserDetails({
                    fullname: data.user_fullname,
                    email: data.user_email,
                    phone: data.user_phone,
                    city: data.user_city,
                    state: data.user_state,
                    zip: data.user_zip,
                    country: data.user_country,
                });
                setPayments(data.payments);
                setCreditDetails(data.creditdetails);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) return <div className="manage-payments-loading">Loading...</div>;
    if (error) return <div className="manage-payments-error">Error: {error}</div>;

    return (
        <div className="manage-payments-container">

            {userDetails && (
                <section className="manage-payments-section manage-payments-box">
                    <h3 className="manage-payments-section-title">User Details</h3>
                    <ul className="manage-payments-details-list">
                        <li><strong>Name:</strong> {userDetails.fullname}</li>
                        <li><strong>Email:</strong> {userDetails.email}</li>
                        <li><strong>Phone:</strong> {userDetails.phone}</li>
                        <li><strong>Address:</strong> {userDetails.city} {userDetails.state} {userDetails.zip} {userDetails.country}</li>
                    </ul>
                </section>
            )}

            {creditDetails && (
                <section className="manage-payments-section manage-payments-box">
                    <h3 className="manage-payments-section-title">Credit Details</h3>
                    <ul className="manage-payments-details-list">
                        <li><strong>Total Credits:</strong> {creditDetails.totalCredits}</li>
                        <li><strong>Used Credits:</strong> {creditDetails.usedCredits}</li>
                        <li><strong>Remaining Credits:</strong> {creditDetails.remainingCredits}</li>
                        <li><strong>Latest Purchase:</strong> {creditDetails.latestPurchase}</li><li>
                            <strong>First time purchase:</strong> {new Date(creditDetails.createdAt).toLocaleString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                            })}
                        </li>
                        <li>
                            <strong>Last time purchase:</strong> {new Date(creditDetails.updatedAt).toLocaleString('en-US', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                            })}
                        </li>


                    </ul>
                </section>
            )}
            {payments.length === 0 ? (
                <p className="manage-payments-no-payments">No payments found.</p>
            ) : (
                <table className="manage-payments-payment-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Transaction ID</th>
                            <th>Amount</th>
                            <th>Credits</th>
                            <th>Payment Method</th>
                            <th>Brand</th>
                            <th>Last 4 digit</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.slice().reverse().map((payment, index) => (
                            <tr key={payment._id}>
                                <td>{index + 1}</td>
                                {payment.transactionId  ? (
                                        <td>{payment.transactionId}</td> 
                                    ) : (    
                                        <td>N/A</td>
                                        )
                                }
                                <td>{(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}</td>
                                <td>{payment.amount / 100}</td>

                                {/* Display payment method type if available */}
                                {payment.paymentMethod?.type ? (
                                    <td>{payment.paymentMethod.type}</td>
                                ):(
                                    <td>--------</td>
                                )}

                                {/* Display card brand if available */}
                                {payment.paymentMethod?.card?.brand ? (
                                    <td>{payment.paymentMethod.card.brand}</td>
                                ):(
                                    <td>--------</td>
                                )}

                                {/* Display card last4 if available */}
                                {payment.paymentMethod?.card?.last4 ? (
                                    <td>**** **** **** {payment.paymentMethod.card.last4}</td>
                                ):(
                                    <td>--------</td>
                                )}
                                {
                                    payment.status === 'requires_payment_method' ? (
                                        <td>Incomplete</td>
                                    ) : (
                                        <td>{payment.status}</td>
                                    )
                                }
                                <td>{new Date(payment.created).toLocaleString()}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManagePayment;
