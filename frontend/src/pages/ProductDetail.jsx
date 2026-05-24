import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Star, Truck, Shield, RefreshCw, Package, Plus, Minus } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductDetail.css';

const Stars = ({ rating, size = 16 }) => (
  <div className="stars">
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={size} fill={i <= Math.round(rating) ? '#FFD700' : 'none'} stroke={i <= Math.round(rating) ? '#FFD700' : '#d1d5db'} />
    ))}
  </div>
);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.product);
      } catch (err) {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product._id, qty);
    setAdding(false);
  };

  const handleBuyNow = async () => {
    if (!user) { navigate('/login'); return; }
    const success = await addToCart(product._id, qty);
    if (success) navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, reviewForm);
      toast.success('Review submitted!');
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="container" style={{ padding: '60px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-lg)' }} />
        <div>
          {[80, 60, 40, 40, 100].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: 20, width: `${w}%`, marginBottom: 16, borderRadius: 8 }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const images = product.images?.length > 0 ? product.images : [`https://picsum.photos/seed/${product._id}/600/500`];

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/"><span>Home</span></Link>
          <span>/</span>
          <Link to="/products"><span>Products</span></Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`}><span>{product.category}</span></Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>

        <div className="detail-grid">
          {/* Images */}
          <div className="detail-images">
            <div className="main-img-wrap">
              <img
                src={images[activeImg]}
                alt={product.name}
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.name}/600/500`; }}
              />
              {discount > 0 && <div className="big-discount-badge">-{discount}% OFF</div>}
              {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
            </div>
            {images.length > 1 && (
              <div className="thumb-row">
                {images.map((img, i) => (
                  <button key={i} className={`thumb-btn ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`view ${i}`} onError={(e) => { e.target.src = `https://picsum.photos/seed/${i}/100`; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-category">{product.category} · {product.brand}</div>
            <h1 className="detail-name">{product.name}</h1>

            {product.ratings > 0 && (
              <div className="detail-rating">
                <Stars rating={product.ratings} />
                <span className="rating-score">{product.ratings.toFixed(1)}</span>
                <span className="rating-count">({product.numReviews} reviews)</span>
              </div>
            )}

            <div className="detail-price-section">
              <span className="detail-price">₹{product.price.toLocaleString('en-IN')}</span>
              {discount > 0 && (
                <>
                  <span className="detail-original">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="detail-discount-badge">{discount}% OFF</span>
                </>
              )}
            </div>

            <div className="detail-desc">{product.description}</div>

            {/* Stock */}
            <div className={`stock-status ${product.stock === 0 ? 'out' : product.stock <= 10 ? 'low' : 'in'}`}>
              <Package size={16} />
              {product.stock === 0 ? 'Out of Stock' : product.stock <= 10 ? `Only ${product.stock} left!` : `In Stock (${product.stock} available)`}
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="qty-section">
                <span className="qty-label">Quantity:</span>
                <div className="qty-control">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} disabled={qty <= 1}><Minus size={16} /></button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(Math.min(product.stock, qty + 1))} disabled={qty >= product.stock}><Plus size={16} /></button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="detail-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || adding}
              >
                {adding ? <div className="btn-spinner" /> : <ShoppingCart size={20} />}
                {isInCart(product._id) ? 'Add More to Cart' : 'Add to Cart'}
              </button>
              <button
                className="btn btn-dark btn-lg"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Perks */}
            <div className="detail-perks">
              <div className="perk"><Truck size={16} /> Free delivery on orders above ₹999</div>
              <div className="perk"><RefreshCw size={16} /> 7-day easy return policy</div>
              <div className="perk"><Shield size={16} /> Secure payment & buyer protection</div>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="detail-tags">
                {product.tags.map(tag => (
                  <Link key={tag} to={`/products?search=${tag}`} className="tag">#{tag}</Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reviews section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          {/* Review form */}
          {user && (
            <form className="review-form" onSubmit={submitReview}>
              <h3>Write a Review</h3>
              <div className="star-select">
                <span>Rating:</span>
                {[1,2,3,4,5].map(r => (
                  <button key={r} type="button" onClick={() => setReviewForm(p => ({...p, rating: r}))}>
                    <Star size={24} fill={r <= reviewForm.rating ? '#FFD700' : 'none'} stroke={r <= reviewForm.rating ? '#FFD700' : '#d1d5db'} />
                  </button>
                ))}
              </div>
              <textarea
                className="form-input"
                placeholder="Share your experience with this product..."
                value={reviewForm.comment}
                onChange={e => setReviewForm(p => ({...p, comment: e.target.value}))}
                rows={4}
                required
              />
              <button className="btn btn-primary" type="submit" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          {product.reviews?.length === 0 ? (
            <div className="no-reviews">
              <Star size={40} />
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="reviews-list">
              {product.reviews.map((review, i) => (
                <div key={i} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-avatar">{review.name[0]}</div>
                    <div>
                      <strong>{review.name}</strong>
                      <Stars rating={review.rating} size={13} />
                    </div>
                    <span className="review-date">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
