import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Check } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalPrice, fetchCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: 'India',
    paymentMethod: 'COD'
  });

  const shipping = totalPrice > 999 ? 0 : 49;
  const tax = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + shipping + tax;

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.state || !form.pincode) {
      toast.error('Please fill in all address fields'); return;
    }
    setLoading(true);
    try {
      const { paymentMethod, ...addr } = form;
      const res = await api.post('/orders', {
        shippingAddress: addr,
        paymentMethod
      });
      await fetchCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const items = cart?.items || [];

  return (
    <div className="checkout-page">
      <div className="page-header">
        <div className="container">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>
      </div>

      <div className="container checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          {/* Address */}
          <div className="checkout-section">
            <h2><MapPin size={20} /> Delivery Address</h2>
            <div className="form-grid-2">
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Street Address</label>
                <input name="street" className="form-input" value={form.street} onChange={handleChange} placeholder="House no., street, area" required />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input name="city" className="form-input" value={form.city} onChange={handleChange} placeholder="City" required />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input name="state" className="form-input" value={form.state} onChange={handleChange} placeholder="State" required />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input name="pincode" className="form-input" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" required maxLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input name="country" className="form-input" value={form.country} disabled />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="checkout-section">
            <h2><CreditCard size={20} /> Payment Method</h2>
            <div className="payment-options">
              {[
                { value: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                { value: 'UPI', label: 'UPI Payment', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                { value: 'Card', label: 'Debit/Credit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                { value: 'NetBanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
              ].map(opt => (
                <label key={opt.value} className={`payment-option ${form.paymentMethod === opt.value ? 'selected' : ''}`}>
                  <input type="radio" name="paymentMethod" value={opt.value} checked={form.paymentMethod === opt.value} onChange={handleChange} />
                  <span className="pay-icon">{opt.icon}</span>
                  <div>
                    <strong>{opt.label}</strong>
                    <span>{opt.desc}</span>
                  </div>
                  {form.paymentMethod === opt.value && <Check size={16} className="check-icon" />}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg place-order-btn" disabled={loading}>
            {loading ? <><div className="btn-spinner" /> Placing Order...</> : <>🎉 Place Order — ₹{grandTotal.toLocaleString('en-IN')}</>}
          </button>
        </form>

        {/* Order summary */}
        <div className="checkout-summary">
          <div className="summary-card">
            <h3>Order Summary ({items.length} items)</h3>
            <div className="checkout-items">
              {items.map(item => {
                const product = item.product;
                if (!product) return null;
                return (
                  <div key={item._id} className="checkout-item">
                    <img src={product.images?.[0] || `https://picsum.photos/seed/${product._id}/80`} alt={product.name} onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.name}/80`; }} />
                    <div className="checkout-item-info">
                      <span className="co-item-name">{product.name}</span>
                      <span className="co-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="co-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>
            <div className="summary-divider" />
            <div className="summary-rows">
              <div className="summary-row"><span>Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
              <div className="summary-row"><span>Shipping</span><span className={shipping === 0 ? 'free-tag' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              <div className="summary-row"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
            </div>
            <div className="summary-divider" />
            <div className="summary-total"><span>Total</span><span>₹{grandTotal.toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
