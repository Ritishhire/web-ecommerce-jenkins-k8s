import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Admin.css';

const STATUS_OPTIONS = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Processing: '#3b82f6', Confirmed: '#f59e0b',
  Shipped: '#8b5cf6', Delivered: '#10b981', Cancelled: '#ef4444',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.orders);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(o => {
    const matchSearch = !search || o._id.includes(search) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || o.orderStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalRevenue = filtered.reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>🛍️ Manage Orders</h1>
          <p>View and update order statuses</p>
        </div>
      </div>

      <div className="container admin-content">
        {/* Toolbar */}
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="admin-filter-select"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="admin-revenue-badge">
            Revenue: <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>
        ) : (
          <div className="orders-admin-list fade-in">
            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: 'var(--gray-400)' }}>No orders found</div>
            )}
            {filtered.map(order => (
              <div key={order._id} className="order-admin-card">
                <div
                  className="order-admin-header"
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  <div className="order-admin-left">
                    <code className="order-admin-id">#{order._id.slice(-8).toUpperCase()}</code>
                    <div className="order-admin-user">
                      <strong>{order.user?.name || 'Unknown'}</strong>
                      <span>{order.user?.email}</span>
                    </div>
                  </div>
                  <div className="order-admin-right">
                    <div className="order-admin-date">{new Date(order.createdAt).toLocaleDateString('en-IN')}</div>
                    <strong className="order-admin-total">₹{order.totalPrice.toLocaleString('en-IN')}</strong>
                    <span className="status-pill" style={{ background: STATUS_COLORS[order.orderStatus] + '22', color: STATUS_COLORS[order.orderStatus] }}>
                      {order.orderStatus}
                    </span>
                    <div className="expand-icon">
                      {expanded === order._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {expanded === order._id && (
                  <div className="order-admin-detail fade-in">
                    {/* Items */}
                    <div className="order-admin-items">
                      {order.items.map((item, i) => (
                        <div key={i} className="order-admin-item">
                          <img src={item.image || `https://picsum.photos/seed/${item.name}/60`} alt={item.name} onError={e => { e.target.src = `https://picsum.photos/seed/${item.name}/60`; }} />
                          <div>
                            <strong>{item.name}</strong>
                            <span>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</span>
                          </div>
                          <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                        </div>
                      ))}
                    </div>

                    {/* Address + Status Update */}
                    <div className="order-admin-footer">
                      <div className="order-admin-address">
                        <h4>📍 Shipping Address</h4>
                        <p>
                          {order.shippingAddress?.street},<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
                        </p>
                        <p style={{ marginTop: 6 }}>💳 {order.paymentMethod} · {order.isPaid ? '✅ Paid' : '⏳ Pending'}</p>
                      </div>
                      <div className="order-status-update">
                        <h4>Update Status</h4>
                        <div className="status-btn-row">
                          {STATUS_OPTIONS.map(s => (
                            <button
                              key={s}
                              className={`status-update-btn ${order.orderStatus === s ? 'active' : ''}`}
                              style={order.orderStatus === s ? { background: STATUS_COLORS[s], color: 'white', borderColor: STATUS_COLORS[s] } : {}}
                              onClick={() => updateStatus(order._id, s)}
                              disabled={updating === order._id}
                            >
                              {updating === order._id ? '...' : s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
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
