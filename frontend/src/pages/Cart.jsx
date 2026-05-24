import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalItems, totalPrice, cartLoading } = useCart();
  const navigate = useNavigate();
  const items = cart?.items || [];

  const shipping = totalPrice > 999 ? 0 : 49;
  const tax = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + shipping + tax;

  if (cartLoading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
      <div className="spinner" />
    </div>
  );

  if (items.length === 0) return (
    <div className="empty-state" style={{ padding: '100px 20px' }}>
      <ShoppingBag size={80} />
      <h3>Your cart is empty</h3>
      <p>Add some amazing products to your cart and they'll show up here!</p>
      <Link to="/products" className="btn btn-primary btn-lg">
        Start Shopping <ArrowRight size={18} />
      </Link>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="page-header">
        <div className="container">
          <h1>🛒 My Cart</h1>
          <p>{totalItems} item{totalItems !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container cart-layout">
        {/* Items */}
        <div className="cart-items">
          <div className="cart-items-header">
            <h2>Cart Items</h2>
            <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
          </div>

          {items.map(item => {
            const product = item.product;
            if (!product) return null;
            const imgSrc = product.images?.[0] || `https://picsum.photos/seed/${product._id}/300/300`;
            const itemTotal = item.price * item.quantity;

            return (
              <div key={item._id} className="cart-item fade-in">
                <Link to={`/products/${product._id}`} className="cart-item-img">
                  <img src={imgSrc} alt={product.name} onError={(e) => { e.target.src = `https://picsum.photos/seed/${product.name}/300`; }} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/products/${product._id}`} className="cart-item-name">{product.name}</Link>
                  <div className="cart-item-price-unit">₹{item.price.toLocaleString('en-IN')} each</div>
                  {product.stock <= 5 && <div className="low-stock-warn">⚠️ Only {product.stock} left</div>}
                </div>
                <div className="cart-item-qty">
                  <button onClick={() => updateQuantity(product._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(product._id, item.quantity + 1)} disabled={item.quantity >= product.stock}>
                    <Plus size={14} />
                  </button>
                </div>
                <div className="cart-item-total">₹{itemTotal.toLocaleString('en-IN')}</div>
                <button className="remove-btn" onClick={() => removeFromCart(product._id)} title="Remove">
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free-tag' : ''}>
                  {shipping === 0 ? '🎉 FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              {shipping === 0 && (
                <div className="free-ship-note">
                  <Tag size={13} /> Free shipping applied!
                </div>
              )}
              {totalPrice < 999 && (
                <div className="ship-hint">
                  Add ₹{(999 - totalPrice).toLocaleString('en-IN')} more for free shipping
                </div>
              )}
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/checkout')}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <div className="secure-note">
              🔒 Secure 128-bit SSL encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
