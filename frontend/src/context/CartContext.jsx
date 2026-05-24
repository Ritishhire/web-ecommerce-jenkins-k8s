import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0, totalItems: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], totalPrice: 0, totalItems: 0 }); return; }
    try {
      setCartLoading(true);
      const res = await api.get('/cart');
      setCart(res.data.cart || { items: [], totalPrice: 0, totalItems: 0 });
    } catch (err) {
      console.error('Cart fetch error:', err);
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add items to cart'); return false; }
    try {
      const res = await api.post('/cart/add', { productId, quantity });
      setCart(res.data.cart);
      toast.success('Added to cart! 🛒');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.put(`/cart/update/${productId}`, { quantity });
      setCart(res.data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/remove/${productId}`);
      setCart(res.data.cart);
      toast.success('Removed from cart');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
    } catch (err) {
      toast.error('Failed to clear cart');
    }
  };

  const isInCart = (productId) => cart.items?.some(i => i.product?._id === productId);
  const getItemQty = (productId) => cart.items?.find(i => i.product?._id === productId)?.quantity || 0;

  return (
    <CartContext.Provider value={{
      cart, cartLoading, fetchCart,
      addToCart, updateQuantity, removeFromCart, clearCart,
      isInCart, getItemQty,
      totalItems: cart.totalItems || 0,
      totalPrice: cart.totalPrice || 0
    }}>
      {children}
    </CartContext.Provider>
  );
};
