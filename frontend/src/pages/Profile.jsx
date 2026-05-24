import React, { useState } from 'react';
import { User, MapPin, Lock, Save } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
    }
  });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/update-profile', profileForm);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await api.put('/auth/change-password', { currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.success('Password changed!');
      setPwdForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="container">
          <h1>My Profile</h1>
          <p>Manage your account details</p>
        </div>
      </div>

      <div className="container profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-avatar-big">{user?.name?.[0]?.toUpperCase() || '?'}</div>
          <div className="profile-name">{user?.name || 'User'}</div>
          <div className="profile-email">{user?.email || ''}</div>
          <div className="profile-role-badge">{user?.role === 'admin' ? '👑 Admin' : '🛍️ Customer'}</div>
          <div className="profile-since">Member since {new Date(user?.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })}</div>

          <div className="profile-tabs">
            <button className={`profile-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>
              <User size={16} /> Profile Info
            </button>
            <button className={`profile-tab ${tab === 'address' ? 'active' : ''}`} onClick={() => setTab('address')}>
              <MapPin size={16} /> Address
            </button>
            <button className={`profile-tab ${tab === 'password' ? 'active' : ''}`} onClick={() => setTab('password')}>
              <Lock size={16} /> Change Password
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="profile-main">
          {tab === 'profile' && (
            <div className="profile-section fade-in">
              <h2>Personal Information</h2>
              <form onSubmit={saveProfile}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" value={user?.email} disabled style={{ opacity: 0.6 }} />
                  <small style={{ color: 'var(--gray-400)', fontSize: 12 }}>Email cannot be changed</small>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {tab === 'address' && (
            <div className="profile-section fade-in">
              <h2>Delivery Address</h2>
              <form onSubmit={saveProfile}>
                <div className="form-group">
                  <label className="form-label">Street Address</label>
                  <input className="form-input" placeholder="House no., street, area" value={profileForm.address.street} onChange={e => setProfileForm(p => ({ ...p, address: { ...p.address, street: e.target.value } }))} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" placeholder="City" value={profileForm.address.city} onChange={e => setProfileForm(p => ({ ...p, address: { ...p.address, city: e.target.value } }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" placeholder="State" value={profileForm.address.state} onChange={e => setProfileForm(p => ({ ...p, address: { ...p.address, state: e.target.value } }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input className="form-input" placeholder="Pincode" value={profileForm.address.pincode} onChange={e => setProfileForm(p => ({ ...p, address: { ...p.address, pincode: e.target.value } }))} maxLength={6} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Saving...' : 'Save Address'}
                </button>
              </form>
            </div>
          )}

          {tab === 'password' && (
            <div className="profile-section fade-in">
              <h2>Change Password</h2>
              <form onSubmit={savePassword}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" value={pwdForm.currentPassword} onChange={e => setPwdForm(p => ({ ...p, currentPassword: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" placeholder="Min. 6 characters" value={pwdForm.newPassword} onChange={e => setPwdForm(p => ({ ...p, newPassword: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" value={pwdForm.confirm} onChange={e => setPwdForm(p => ({ ...p, confirm: e.target.value }))} required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Lock size={16} /> {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}