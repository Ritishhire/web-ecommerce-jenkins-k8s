# 🛍️ ShopWave — Full-Stack MERN E-Commerce

A complete, production-ready e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication, full product CRUD, cart management, order processing, and an admin dashboard.

---

## 🚀 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18 + Vite + React Router v6       |
| Backend   | Node.js + Express.js                    |
| Database  | MongoDB + Mongoose ODM                  |
| Auth      | JWT (JSON Web Tokens) + bcryptjs        |
| Styling   | Pure CSS (no framework)                 |
| HTTP      | Axios with interceptors                 |
| Toasts    | react-hot-toast                         |

---

## ✨ Features

### 🔐 Authentication
- Register / Login with JWT token
- Token stored in localStorage
- Auto-attach token via Axios interceptor
- Protected routes (PrivateRoute, AdminRoute)
- Role-based access: `user` | `admin`
- Change password, update profile

### 🛒 Shopping
- Browse 30+ products across 8 categories
- Full-text search (name, brand, tags, description)
- Filter by category, price range, rating
- Sort: newest, price asc/desc, rating, popular
- Pagination
- Product detail page with image gallery
- Add to cart, wishlist toggle
- Write reviews with star rating

### 🛍️ Cart & Checkout
- Add/remove items, update quantity
- Cart persists in MongoDB per user
- Auto-calculate subtotal, shipping (free over ₹999), GST (18%)
- Checkout with shipping address form
- Payment method: COD, UPI, Card, Net Banking
- Order confirmation & history

### 👑 Admin Panel
- Dashboard with revenue, orders, products, users stats
- Product CRUD: create, edit, delete with image URLs, tags
- Order management: view all orders, update status
- User management: view, change roles, delete

---

## 📁 Project Structure

```
ecommerce/
├── backend/
│   ├── models/
│   │   ├── User.js       # JWT methods, bcrypt
│   │   ├── Product.js    # Reviews, ratings
│   │   ├── Cart.js       # Auto-calculate totals
│   │   └── Order.js      # Order lifecycle
│   ├── routes/
│   │   ├── auth.js       # register, login, me, update
│   │   ├── products.js   # CRUD + search + reviews
│   │   ├── cart.js       # add, update, remove, clear
│   │   ├── orders.js     # place, list, cancel
│   │   └── admin.js      # stats, users
│   ├── middleware/
│   │   └── auth.js       # protect, authorize
│   ├── server.js
│   ├── seed.js           # 30+ sample products
│   └── .env
│
└── frontend/
    └── src/
        ├── context/
        │   ├── AuthContext.jsx   # Global auth state
        │   └── CartContext.jsx   # Global cart state
        ├── utils/
        │   └── api.js            # Axios + JWT interceptor
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   └── ProductCard.jsx
        └── pages/
            ├── Home.jsx
            ├── Products.jsx       # Search, filter, sort
            ├── ProductDetail.jsx  # Gallery, reviews
            ├── Cart.jsx
            ├── Checkout.jsx
            ├── Orders.jsx
            ├── Profile.jsx
            ├── Login.jsx
            ├── Register.jsx
            └── admin/
                ├── AdminDashboard.jsx
                ├── AdminProducts.jsx
                ├── AdminOrders.jsx
                └── AdminUsers.jsx
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

### Step 1: Clone & Install

```bash
# Backend
cd ecommerce/backend
npm install

# Frontend
cd ecommerce/frontend
npm install
```

---

### Step 2: Configure Environment

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shopwave
JWT_SECRET=shopwave_super_secret_jwt_key_2024
JWT_EXPIRE=7d
NODE_ENV=development
```

For MongoDB Atlas:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/shopwave
```

---

### Step 3: Seed Database

```bash
cd backend
npm run seed
```

This creates:
- **Admin:** admin@shopwave.com / admin123
- **User:** ritish@example.com / test123
- **30+ products** across 8 categories

---

### Step 4: Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open: **http://localhost:3000**

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint                  | Access  |
|--------|---------------------------|---------|
| POST   | /api/auth/register        | Public  |
| POST   | /api/auth/login           | Public  |
| GET    | /api/auth/me              | Private |
| PUT    | /api/auth/update-profile  | Private |
| PUT    | /api/auth/change-password | Private |

### Products
| Method | Endpoint                    | Access  |
|--------|-----------------------------|---------|
| GET    | /api/products               | Public  |
| GET    | /api/products/:id           | Public  |
| POST   | /api/products               | Admin   |
| PUT    | /api/products/:id           | Admin   |
| DELETE | /api/products/:id           | Admin   |
| POST   | /api/products/:id/reviews   | Private |

### Cart
| Method | Endpoint                        | Access  |
|--------|---------------------------------|---------|
| GET    | /api/cart                       | Private |
| POST   | /api/cart/add                   | Private |
| PUT    | /api/cart/update/:productId     | Private |
| DELETE | /api/cart/remove/:productId     | Private |
| DELETE | /api/cart/clear                 | Private |

### Orders
| Method | Endpoint            | Access  |
|--------|---------------------|---------|
| POST   | /api/orders         | Private |
| GET    | /api/orders/my      | Private |
| GET    | /api/orders/:id     | Private |
| PUT    | /api/orders/:id/cancel | Private |
| GET    | /api/orders         | Admin   |
| PUT    | /api/orders/:id/status | Admin |

---

## 🌐 Deployment

### Backend (Railway / Render)
1. Push backend folder to GitHub
2. Connect to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel / Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set `VITE_API_URL` if needed

---

Built with ❤️ in India 🇮🇳
