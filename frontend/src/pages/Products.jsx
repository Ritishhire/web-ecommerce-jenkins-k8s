import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Grid3X3, List, Search } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Toys', 'Grocery'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [localSearch, setLocalSearch] = useState(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (category && category !== 'All') params.set('category', category);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('page', page);
      params.set('limit', 12);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, minPrice, maxPrice, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All') next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const applyPriceFilter = () => {
    const next = new URLSearchParams(searchParams);
    if (localMin) next.set('minPrice', localMin); else next.delete('minPrice');
    if (localMax) next.set('maxPrice', localMax); else next.delete('maxPrice');
    next.delete('page');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', localSearch);
  };

  const clearFilters = () => {
    setLocalMin(''); setLocalMax(''); setLocalSearch('');
    setSearchParams({});
  };

  const hasFilters = search || category !== 'All' || minPrice || maxPrice;

  return (
    <div className="products-page">
      {/* Page header */}
      <div className="products-header">
        <div className="container">
          <h1>
            {search ? `Results for "${search}"` : category !== 'All' ? category : 'All Products'}
          </h1>
          <p>{total} products found</p>
        </div>
      </div>

      <div className="container products-layout">
        {/* Sidebar */}
        <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="filters-header">
            <h3><SlidersHorizontal size={18} /> Filters</h3>
            {hasFilters && <button className="clear-filters" onClick={clearFilters}><X size={14} /> Clear All</button>}
          </div>

          {/* Search */}
          <div className="filter-section">
            <h4>Search</h4>
            <form onSubmit={handleSearchSubmit} className="filter-search">
              <input
                type="text"
                placeholder="Search products..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                className="form-input"
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: 8 }}>
                <Search size={14} /> Search
              </button>
            </form>
          </div>

          {/* Category */}
          <div className="filter-section">
            <h4>Category</h4>
            <div className="category-filters">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`cat-filter-btn ${(category === cat || (cat === 'All' && !category)) ? 'active' : ''}`}
                  onClick={() => updateParam('category', cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="filter-section">
            <h4>Price Range (₹)</h4>
            <div className="price-inputs">
              <input type="number" placeholder="Min" value={localMin} onChange={e => setLocalMin(e.target.value)} className="form-input" />
              <span>–</span>
              <input type="number" placeholder="Max" value={localMax} onChange={e => setLocalMax(e.target.value)} className="form-input" />
            </div>
            <button className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 10 }} onClick={applyPriceFilter}>
              Apply Price Filter
            </button>
          </div>

          {/* Rating */}
          <div className="filter-section">
            <h4>Minimum Rating</h4>
            {[4, 3, 2, 1].map(r => (
              <button key={r} className="rating-filter-btn" onClick={() => updateParam('rating', r)}>
                {'⭐'.repeat(r)} & above
              </button>
            ))}
          </div>

          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setShowFilters(false)}>
            <X size={14} /> Close Filters
          </button>
        </aside>

        {/* Main content */}
        <div className="products-main">
          {/* Toolbar */}
          <div className="products-toolbar">
            <button className="btn btn-ghost btn-sm filter-toggle-btn" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal size={16} /> Filters
              {hasFilters && <span className="filter-dot" />}
            </button>

            <div className="active-filters">
              {search && <span className="active-tag">🔍 {search} <button onClick={() => updateParam('search', '')}>×</button></span>}
              {category !== 'All' && <span className="active-tag">📂 {category} <button onClick={() => updateParam('category', 'All')}>×</button></span>}
              {(minPrice || maxPrice) && <span className="active-tag">💰 ₹{minPrice||'0'} – ₹{maxPrice||'∞'} <button onClick={() => { setLocalMin(''); setLocalMax(''); updateParam('minPrice',''); updateParam('maxPrice',''); }}>×</button></span>}
            </div>

            <div className="sort-wrap">
              <select value={sort} onChange={e => updateParam('sort', e.target.value)} className="sort-select">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="products-grid">
              {Array(12).fill(0).map((_, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'white' }}>
                  <div className="skeleton" style={{ height: 200 }} />
                  <div style={{ padding: 14 }}>
                    <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 32, marginTop: 16 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <Search size={60} />
              <h3>No products found</h3>
              <p>Try different keywords or filters</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid fade-in">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-ghost btn-sm"
                disabled={page <= 1}
                onClick={() => updateParam('page', page - 1)}
              >← Prev</button>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`page-btn ${p === page ? 'active' : ''}`}
                  onClick={() => updateParam('page', p)}
                >{p}</button>
              ))}
              <button
                className="btn btn-ghost btn-sm"
                disabled={page >= pages}
                onClick={() => updateParam('page', page + 1)}
              >Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
