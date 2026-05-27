import React, { useState } from 'react';
import './SSUCheckout.css';

export default function SSUCheckout({ onPaymentDone, initialName = '', initialEmail = '', initialAmount = '500' }) {
  const [form, setForm] = useState({ name: initialName, email: initialEmail, amount: initialAmount });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setError(''); };
  const handlePay = async (e) => {
    e.preventDefault(); setError('');
    const amount = parseInt(form.amount);
    if (!amount || amount < 1) return setError('Please enter a valid amount.');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/create-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount }) });
      const order = await res.json();
      if (!order.id) throw new Error(order.error || 'Failed to create order');
      const options = {
        key: 'rzp_test_St9Dte19QxV7rI', amount: order.amount, currency: 'INR',
        name: 'Test Store', description: 'Test Transaction', order_id: order.id,
        handler: async (response) => {
          const verify = await fetch('http://localhost:5001/api/verify-payment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(response) });
          const result = await verify.json();
          onPaymentDone(result);
        },
        prefill: { name: form.name || 'Test User', email: form.email || 'test@test.com' },
        theme: { color: '#3399cc' }, modal: { ondismiss: () => setLoading(false) }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r) => { setError('Payment failed: ' + r.error.description); setLoading(false); });
      rzp.open();
    } catch (err) { setError(err.message); setLoading(false); }
  };
  return (
    <div className="checkout-card">
      <div className="checkout-icon">&#128179;</div>
      <h1>Test Payment</h1>
      <p className="subtitle">Use test card <strong>4111 1111 1111 1111</strong> to simulate a payment.</p>
      <form onSubmit={handlePay}>
        <div className="field"><label>Name</label><input name="name" type="text" placeholder="Abhinab Kumar" value={form.name} onChange={handleChange} /></div>
        <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} /></div>
        <div className="field">
          <label>Amount (INR) <span className="req">*</span></label>
          <div className="input-wrap"><span className="prefix">&#8377;</span><input name="amount" type="number" placeholder="500" min="1" value={form.amount} onChange={handleChange} required /></div>
        </div>
        {error && <div className="error-msg">&#9888; {error}</div>}
        <button type="submit" className="pay-btn" disabled={loading}>{loading ? <span className="spinner"></span> : 'Pay Now'}</button>
      </form>
    </div>
  );
}
