import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import api from '../../utils/api';
import './Admin.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/orders')
        ]);
        setStats(statsRes.data.stats);
        setRecentOrders(ordersRes.data.orders.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const STATUS_COLORS = {
    Processing: '#3b82f6',
    Confirmed: '#f59e0b',
    Shipped: '#8b5cf6',
    Delivered: '#10b981',
    Cancelled: '#ef4444',
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div className="spinner" />
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>👑 Admin Dashboard</h1>
          <p>Welcome back! Here's what's happening with your store.</p>
        </div>
      </div>

      <div className="container admin-content">
        {/* Stat Cards */}
        <div className="stats-grid">
          {[
            { label: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString('en-IN') || 0}`, icon: <DollarSign size={24} />, color: '#10b981', bg: '#d1fae5', change: '+12%' },
            { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingBag size={24} />, color: '#3b82f6', bg: '#dbeafe', change: '+8%' },
            { label: 'Total Products', value: stats?.totalProducts || 0, icon: <Package size={24} />, color: '#8b5cf6', bg: '#ede9fe', change: '+3%' },
            { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={24} />, color: '#f59e0b', bg: '#fef3c7', change: '+15%' },
          ].map((s, i) => (
            <div key={i} className="stat-card fade-in">
              <div className="stat-card-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
              <div className="stat-card-body">
                <div className="stat-card-value">{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
              <div className="stat-card-change" style={{ color: s.color }}>
                <TrendingUp size={14} /> {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="admin-quick-links">
          {[
            { to: '/admin/products', icon: <Package size={20} />, label: 'Manage Products', desc: 'Add, edit, delete products' },
            { to: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Manage Orders', desc: 'View and update orders' },
            { to: '/admin/users', icon: <Users size={20} />, label: 'Manage Users', desc: 'View and manage users' },
          ].map((link, i) => (
            <Link key={i} to={link.to} className="quick-link-card">
              <div className="quick-link-icon">{link.icon}</div>
              <div>
                <strong>{link.label}</strong>
                <span>{link.desc}</span>
              </div>
              <ArrowRight size={18} className="arrow" />
            </Link>
          ))}
        </div>

        {/* Pending orders alert */}
        {stats?.pendingOrders > 0 && (
          <div className="pending-alert">
            <Clock size={18} />
            <span><strong>{stats.pendingOrders} orders</strong> are pending processing!</span>
            <Link to="/admin/orders" className="btn btn-primary btn-sm">View Orders</Link>
          </div>
        )}

        {/* Recent Orders Table */}
        <div className="admin-section">
          <div className="admin-section-head">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="see-all">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td><code>#{order._id.slice(-8).toUpperCase()}</code></td>
                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                    <td><strong>₹{order.totalPrice.toLocaleString('en-IN')}</strong></td>
                    <td>{order.paymentMethod}</td>
                    <td>
                      <span className="status-pill" style={{ background: STATUS_COLORS[order.orderStatus] + '22', color: STATUS_COLORS[order.orderStatus] }}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 32 }}>No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
