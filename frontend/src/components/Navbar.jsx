import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, ChevronDown, LayoutDashboard, Package, LogOut, Heart, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛍️</span>
          <span>Shop<span className="logo-accent">Wave</span></span>
        </Link>

        {/* Search */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products, brands, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        {/* Right actions */}
        <div className="navbar-actions">
          {/* Cart */}
          <Link to="/cart" className="action-btn cart-btn">
            <ShoppingCart size={22} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {/* User */}
          {user ? (
            <div className="user-menu-wrap" ref={userMenuRef}>
              <button className="user-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className="user-avatar">{user.name?.[0]?.toUpperCase() || '?'}</div>
                <span className="user-name">{user.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown size={14} />
              </button>
              {userMenuOpen && (
                <div className="user-dropdown fade-in">
                  <div className="dropdown-header">
                    <strong>{user.name || 'User'}</strong>
                    <span>{user.email || ''}</span>
                  </div>
                  <div className="dropdown-divider" />
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <LayoutDashboard size={15} /> Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <User size={15} /> My Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <ClipboardList size={15} /> My Orders
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout" onClick={() => { logout(); setUserMenuOpen(false); }}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <div className="cat-nav container">
        {['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Grocery'].map(cat => (
          <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="cat-link">{cat}</Link>
        ))}
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu fade-in">
          <form className="mobile-search" onSubmit={handleSearch}>
            <Search size={16} />
            <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </form>
          <Link to="/products" className="mobile-link">All Products</Link>
          <Link to="/cart" className="mobile-link">Cart ({totalItems})</Link>
          {user ? (
            <>
              <Link to="/profile" className="mobile-link">Profile</Link>
              <Link to="/orders" className="mobile-link">Orders</Link>
              {isAdmin && <Link to="/admin" className="mobile-link">Admin</Link>}
              <button onClick={logout} className="mobile-link mobile-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link">Login</Link>
              <Link to="/register" className="mobile-link">Register</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}