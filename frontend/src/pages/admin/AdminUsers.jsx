import React, { useState, useEffect } from 'react';
import { Trash2, Shield, User, Search } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Admin.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user: me } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change role to "${newRole}"?`)) return;
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>👥 Manage Users</h1>
          <p>{users.length} registered users</p>
        </div>
      </div>

      <div className="container admin-content">
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <div className="admin-count-badge">
            Total: <strong>{filtered.length}</strong> users
          </div>
        </div>

        <div className="admin-table-wrap fade-in">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 16, borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.map(u => (
                <tr key={u._id} className={u._id === me?._id ? 'highlight-row' : ''}>
                  <td>
                    <div className="user-avatar-cell">{u.name[0].toUpperCase()}</div>
                  </td>
                  <td>
                    <div className="user-name-cell">
                      <strong>{u.name}</strong>
                      {u._id === me?._id && <span className="you-badge">You</span>}
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--gray-600)' }}>{u.email}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>
                      {u.role === 'admin' ? '👑 Admin' : '🛍️ User'}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                    {new Date(u.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td>
                    <div className="action-btns">
                      {u._id !== me?._id && (
                        <>
                          <button
                            className={`action-btn-icon ${u.role === 'admin' ? 'warn' : 'edit'}`}
                            onClick={() => toggleRole(u._id, u.role)}
                            title={u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                          >
                            <Shield size={15} />
                          </button>
                          <button
                            className="action-btn-icon del"
                            onClick={() => deleteUser(u._id, u.name)}
                            title="Delete User"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                      {u._id === me?._id && <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>—</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--gray-400)' }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
