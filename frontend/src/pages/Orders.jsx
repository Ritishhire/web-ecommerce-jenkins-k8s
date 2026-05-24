import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, X } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Orders.css';

const STATUS_COLORS = {
  Processing: 'badge-blue',
  Confirmed: 'badge-orange',
  Shipped: 'badge-orange',
  Delivered: 'badge-green',
  Cancelled: 'badge-red',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data.orders);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="orders-page">
      <div className="page-header">
        <div className="container">
          <h1>📦 My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      <div className="container" style={{ marginTop: 32, paddingBottom: 60 }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <Package size={80} />
            <h3>No orders yet</h3>
            <p>You haven't placed any orders. Start shopping!</p>
            <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card fade-in">
                <div className="order-header" onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                  <div className="order-meta">
                    <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div className="order-summary-row">
                    <span className={`badge ${STATUS_COLORS[order.orderStatus] || 'badge-gray'}`}>{order.orderStatus}</span>
                    <span className="order-total">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                    <span className="order-items-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="expand-icon">
                    {expanded === order._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {expanded === order._id && (
                  <div className="order-detail fade-in">
                    {/* Items */}
                    <div className="order-items-list">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-item">
                          <img src={item.image || `https://picsum.photos/seed/${item.name}/80`} alt={item.name} onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.name}/80`; }} />
                          <div className="order-item-info">
                            <span className="order-item-name">{item.name}</span>
                            <span className="order-item-qty">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</span>
                          </div>
                          <span className="order-item-total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Address & Payment */}
                    <div className="order-info-grid">
                      <div className="order-info-box">
                        <h4>📍 Delivery Address</h4>
                        <p>
                          {order.shippingAddress.street},<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                          {order.shippingAddress.pincode}, {order.shippingAddress.country}
                        </p>
                      </div>
                      <div className="order-info-box">
                        <h4>💳 Payment</h4>
                        <p>{order.paymentMethod}</p>
                        <p style={{ marginTop: 4 }}>{order.isPaid ? '✅ Paid' : '⏳ Pending'}</p>
                      </div>
                      <div className="order-info-box">
                        <h4>💰 Price Breakdown</h4>
                        <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <span>Items: ₹{order.itemsPrice?.toLocaleString('en-IN')}</span>
                          <span>Shipping: {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
                          <span>GST: ₹{order.taxPrice?.toLocaleString('en-IN')}</span>
                          <strong>Total: ₹{order.totalPrice.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="order-timeline">
                      {['Processing', 'Confirmed', 'Shipped', 'Delivered'].map((step, i) => {
                        const statuses = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
                        const currentIdx = statuses.indexOf(order.orderStatus);
                        const isDone = i <= currentIdx && order.orderStatus !== 'Cancelled';
                        return (
                          <div key={step} className={`timeline-step ${isDone ? 'done' : ''}`}>
                            <div className="timeline-dot">{isDone ? '✓' : i + 1}</div>
                            <span>{step}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Cancel button */}
                    {['Processing', 'Confirmed'].includes(order.orderStatus) && (
                      <div style={{ marginTop: 16 }}>
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)', borderColor: 'var(--error)' }} onClick={() => cancelOrder(order._id)}>
                          <X size={14} /> Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
