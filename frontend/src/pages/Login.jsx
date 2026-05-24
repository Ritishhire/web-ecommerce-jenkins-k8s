import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

export function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-logo">🛍️ ShopWave</div>
          <h2>Welcome Back!</h2>
          <p>Sign in to access your cart, orders, and exclusive deals.</p>
          <div className="auth-features">
            <div>✅ Track your orders</div>
            <div>✅ Save to wishlist</div>
            <div>✅ Exclusive member deals</div>
          </div>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <h1>Sign In</h1>
          <p className="auth-sub">New to ShopWave? <Link to="/register">Create an account</Link></p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <Mail size={17} className="input-icon" />
                <input
                  type="email"
                  className="form-input with-icon"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <Lock size={17} className="input-icon" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  className="form-input with-icon"
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? <><div className="btn-spinner" /> Signing in...</> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="demo-creds">
            <p>🔑 Demo credentials:</p>
            <div><strong>Admin:</strong> admin@shopwave.com / admin123</div>
            <div><strong>User:</strong> ritish@example.com / test123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to ShopWave 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <div className="auth-logo">🛍️ ShopWave</div>
          <h2>Join ShopWave!</h2>
          <p>Create your account and start shopping India's best products.</p>
          <div className="auth-features">
            <div>🎁 Welcome offers for new users</div>
            <div>🚚 Free shipping on first order</div>
            <div>💳 Secure checkout always</div>
          </div>
        </div>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-card">
          <h1>Create Account</h1>
          <p className="auth-sub">Already have an account? <Link to="/login">Sign in</Link></p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrap">
                <User size={17} className="input-icon" />
                <input type="text" className="form-input with-icon" placeholder="Your full name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <Mail size={17} className="input-icon" />
                <input type="email" className="form-input with-icon" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <Lock size={17} className="input-icon" />
                <input type={showPwd ? 'text' : 'password'} className="form-input with-icon" placeholder="Min. 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                <button type="button" className="pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap">
                <Lock size={17} className="input-icon" />
                <input type="password" className="form-input with-icon" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
              {loading ? <><div className="btn-spinner" /> Creating account...</> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
