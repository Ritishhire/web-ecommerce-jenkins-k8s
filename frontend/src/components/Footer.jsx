import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <div className="footer-logo">🛍️ Shop<span>Wave</span></div>
          <p>India's premium online shopping destination. Quality products, great prices, fast delivery.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h4>Shop</h4>
          <Link to="/products?category=Electronics">Electronics</Link>
          <Link to="/products?category=Fashion">Fashion</Link>
          <Link to="/products?category=Home & Living">Home & Living</Link>
          <Link to="/products?category=Sports">Sports</Link>
          <Link to="/products?category=Books">Books</Link>
        </div>

        <div className="footer-links">
          <h4>Account</h4>
          <Link to="/profile">My Profile</Link>
          <Link to="/orders">My Orders</Link>
          <Link to="/cart">My Cart</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <div className="contact-item"><Mail size={15} /><span>support@shopwave.in</span></div>
          <div className="contact-item"><Phone size={15} /><span>1800-123-4567 (Toll Free)</span></div>
          <div className="contact-item"><MapPin size={15} /><span>Surat, Gujarat, India</span></div>
          <div className="footer-badges">
            <span>🔒 Secure Payments</span>
            <span>🚚 Fast Delivery</span>
            <span>↩️ Easy Returns</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2024 ShopWave. Built with ❤️ in India.</p>
          <div className="footer-pay-icons">
            <span>💳</span><span>🏦</span><span>📱</span><span>💰</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
