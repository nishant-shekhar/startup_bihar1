import React from 'react';
import './SSUSuccess.css';
export default function SSUSuccess({ result, onReset }) {
  return (
    <div className="success-card">
      <div className="success-icon">&#9989;</div>
      <h2>Payment Successful!</h2>
      <p>{result.message}</p>
      {result.payment_id && (<div className="payment-id"><span className="label">Payment ID</span><code>{result.payment_id}</code></div>)}
      <button className="reset-btn" onClick={onReset}>Make Another Payment</button>
    </div>
  );
}
