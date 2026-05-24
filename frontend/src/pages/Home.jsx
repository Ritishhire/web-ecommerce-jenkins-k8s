import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: '#dbeafe', textColor: '#1e40af' },
  { name: 'Fashion', icon: '👗', color: '#fce7f3', textColor: '#9d174d' },
  { name: 'Home & Living', icon: '🏠', color: '#d1fae5', textColor: '#065f46' },
  { name: 'Sports', icon: '⚽', color: '#fef3c7', textColor: '#92400e' },
  { name: 'Books', icon: '📚', color: '#ede9fe', textColor: '#4c1d95' },
  { name: 'Beauty', icon: '💄', color: '#fce7f3', textColor: '#831843' },
  { name: 'Toys', icon: '🎮', color: '#dbeafe', textColor: '#1e3a8a' },
  { name: 'Grocery', icon: '🛒', color: '#dcfce7', textColor: '#14532d' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featRes, newRes] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?sort=newest&limit=8')
        ]);
        setFeatured(featRes.data.products);
        setNewArrivals(newRes.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-tag">🎉 New Arrivals Every Day</div>
            <h1 className="hero-title">
              Shop Smarter,<br />
              <span className="hero-highlight">Live Better</span>
            </h1>
            <p className="hero-sub">India's premium online store — electronics, fashion, home, and more. Free shipping over ₹999.</p>
            <form className="hero-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="What are you looking for today?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Search <ArrowRight size={16} />
              </button>
            </form>
            <div className="hero-stats">
              <div className="stat"><strong>30+</strong><span>Products</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>8</strong><span>Categories</span></div>
              <div className="stat-divider" />
              <div className="stat"><strong>Free</strong><span>Shipping ₹999+</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card hero-card-1">
              <span>📱</span>
              <div><strong>iPhone 15 Pro</strong><span>₹1,34,900</span></div>
            </div>
            <div className="hero-card hero-card-2">
              <span>👟</span>
              <div><strong>Nike Air Max</strong><span>₹10,995</span></div>
            </div>
            <div className="hero-card hero-card-3">
              <span>🎧</span>
              <div><strong>Sony WH-1000XM5</strong><span>₹26,990</span></div>
            </div>
            <div className="hero-badge">🔥 Trending Now</div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="features-bar">
        <div className="container features-inner">
          {[
            { icon: <Truck size={22} />, title: 'Free Delivery', sub: 'On orders above ₹999' },
            { icon: <Shield size={22} />, title: 'Secure Payment', sub: '100% protected checkout' },
            { icon: <RefreshCw size={22} />, title: 'Easy Returns', sub: '7-day return policy' },
            { icon: <Zap size={22} />, title: 'Fast Support', sub: '24/7 customer care' },
          ].map((f, i) => (
            <div key={i} className="feature-item">
              <div className="feature-icon">{f.icon}</div>
              <div><strong>{f.title}</strong><span>{f.sub}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section container">
        <div className="section-head">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="see-all">View All <ArrowRight size={16} /></Link>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="category-card"
              style={{ background: cat.color }}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name" style={{ color: cat.textColor }}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section container">
        <div className="section-head">
          <h2 className="section-title">⭐ Featured Products</h2>
          <Link to="/products?featured=true" className="see-all">View All <ArrowRight size={16} /></Link>
        </div>
        {loading ? (
          <div className="products-grid">
            {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="products-grid fade-in">
            {featured.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* Promo Banner */}
      <section className="promo-banner container">
        <div className="promo-inner">
          <div>
            <h3>🔥 Hot Deals This Week</h3>
            <p>Up to 40% off on Electronics, Fashion & more. Limited time offer!</p>
          </div>
          <Link to="/products" className="btn btn-primary btn-lg">
            Shop Now <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section container">
        <div className="section-head">
          <h2 className="section-title">🆕 New Arrivals</h2>
          <Link to="/products?sort=newest" className="see-all">View All <ArrowRight size={16} /></Link>
        </div>
        {loading ? (
          <div className="products-grid">
            {Array(8).fill(0).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <div className="products-grid fade-in">
            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: 14 }}>
        <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 16 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton" style={{ height: 20, width: '35%' }} />
          <div className="skeleton" style={{ height: 32, width: '30%', borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}
