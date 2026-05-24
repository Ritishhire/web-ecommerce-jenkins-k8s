import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Search, Save } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Admin.css';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Toys', 'Grocery'];

const EMPTY_FORM = {
  name: '', description: '', price: '', originalPrice: '',
  category: 'Electronics', brand: '', stock: '', isFeatured: false,
  images: [''], tags: ''
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products?limit=100${search ? `&search=${search}` : ''}`);
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || '',
      category: product.category,
      brand: product.brand || '',
      stock: product.stock,
      isFeatured: product.isFeatured || false,
      images: product.images?.length ? product.images : [''],
      tags: product.tags?.join(', ') || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || 0,
        stock: Number(form.stock),
        images: form.images.filter(img => img.trim() !== ''),
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      if (editing) {
        await api.put(`/products/${editing}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const addImageField = () => setForm(p => ({ ...p, images: [...p.images, ''] }));
  const updateImage = (idx, val) => setForm(p => ({ ...p, images: p.images.map((img, i) => i === idx ? val : img) }));
  const removeImage = (idx) => setForm(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <h1>📦 Manage Products</h1>
          <p>Create, edit, and delete products</p>
        </div>
      </div>

      <div className="container admin-content">
        <div className="admin-toolbar">
          <div className="admin-search-wrap">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="admin-search-input"
            />
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={18} /> Add Product
          </button>
        </div>

        <div className="admin-table-wrap fade-in">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(8).fill(0).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 16, borderRadius: 4 }} /></td>
                    ))}
                  </tr>
                ))
              ) : products.map(p => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.images?.[0] || `https://picsum.photos/seed/${p._id}/60`}
                      alt={p.name}
                      className="product-thumb"
                      onError={e => { e.target.src = `https://picsum.photos/seed/${p.name}/60`; }}
                    />
                  </td>
                  <td>
                    <div className="product-name-cell">
                      <strong>{p.name}</strong>
                      <span>{p.brand}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-gray">{p.category}</span></td>
                  <td>
                    <div>
                      <strong>₹{p.price.toLocaleString('en-IN')}</strong>
                      {p.originalPrice > p.price && (
                        <span style={{ fontSize: 11, color: 'var(--gray-400)', display: 'block', textDecoration: 'line-through' }}>
                          ₹{p.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`stock-badge ${p.stock === 0 ? 'out' : p.stock <= 10 ? 'low' : 'ok'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td>⭐ {p.ratings?.toFixed(1) || '0.0'} ({p.numReviews})</td>
                  <td>{p.isFeatured ? '✅' : '—'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn-icon edit" onClick={() => openEdit(p)} title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="action-btn-icon del" onClick={() => deleteProduct(p._id, p.name)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 40 }}>No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-box">
            <div className="modal-head">
              <h2>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-grid-2">
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="e.g. iPhone 15 Pro" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Description *</label>
                  <textarea className="form-input" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required placeholder="Product description..." />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input type="number" className="form-input" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required min="0" placeholder="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input type="number" className="form-input" value={form.originalPrice} onChange={e => setForm(p => ({ ...p, originalPrice: e.target.value }))} min="0" placeholder="0 (for discount)" />
                </div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select className="form-input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input className="form-input" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} placeholder="e.g. Apple" />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input type="number" className="form-input" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} required min="0" placeholder="0" />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 28 }}>
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} />
                  <label htmlFor="featured" style={{ fontWeight: 600, cursor: 'pointer' }}>⭐ Featured Product</label>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Image URLs</label>
                  {form.images.map((img, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input className="form-input" value={img} onChange={e => updateImage(idx, e.target.value)} placeholder="https://... image URL" />
                      {form.images.length > 1 && (
                        <button type="button" className="action-btn-icon del" onClick={() => removeImage(idx)}><X size={14} /></button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addImageField}>
                    <Plus size={14} /> Add Image URL
                  </button>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-input" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="e.g. smartphone, apple, 5g" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <Save size={16} /> {saving ? 'Saving...' : (editing ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
