import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const Stars = ({ rating }) => (
  <div className="stars">
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={12} fill={i <= Math.round(rating) ? '#FFD700' : 'none'} stroke={i <= Math.round(rating) ? '#FFD700' : '#d1d5db'} />
    ))}
    <span className="rating-num">{rating.toFixed(1)}</span>
  </div>
);

export default function ProductCard({ product }) {
  const { addToCart, isInCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [wished, setWished] = useState(false);
  const inCart = isInCart(product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    await addToCart(product._id, 1);
    setAdding(false);
  };

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const imgSrc = product.images?.[0] || `https://picsum.photos/seed/${product._id}/400/300`;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      {/* Image */}
      <div className="product-img-wrap">
        <img src={imgSrc} alt={product.name} loading="lazy" onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.name}/400/300`; }} />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        {product.isFeatured && <span className="featured-badge">⭐ Featured</span>}
        {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}

        <div className="card-actions">
          <button
            className={`wishlist-btn ${wished ? 'wished' : ''}`}
            onClick={(e) => { e.preventDefault(); setWished(!wished); }}
            title="Add to wishlist"
          >
            <Heart size={16} fill={wished ? '#ef4444' : 'none'} stroke={wished ? '#ef4444' : 'currentColor'} />
          </button>
          <Link to={`/products/${product._id}`} className="quick-view-btn" onClick={(e) => e.stopPropagation()} title="Quick view">
            <Eye size={16} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="product-content">
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-brand">{product.brand}</div>

        {product.ratings > 0 && (
          <div className="product-rating">
            <Stars rating={product.ratings} />
            <span className="review-count">({product.numReviews})</span>
          </div>
        )}

        <div className="product-footer">
          <div className="price-wrap">
            <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
            {discount > 0 && <span className="original-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
          </div>
          <button
            className={`add-cart-btn ${inCart ? 'in-cart' : ''} ${adding ? 'loading' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            title={inCart ? 'In Cart' : 'Add to Cart'}
          >
            {adding ? <div className="btn-spinner" /> : <ShoppingCart size={16} />}
            {inCart ? 'In Cart' : 'Add'}
          </button>
        </div>

        {product.stock > 0 && product.stock <= 10 && (
          <div className="low-stock">Only {product.stock} left!</div>
        )}
      </div>
    </Link>
  );
}
