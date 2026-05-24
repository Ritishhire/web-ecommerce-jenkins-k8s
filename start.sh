#!/bin/bash
# ShopWave Startup Script

echo "🛍️  ShopWave E-Commerce Setup"
echo "================================"

# Install backend deps
echo "📦 Installing backend dependencies..."
cd backend && npm install
echo "✅ Backend deps installed"

# Install frontend deps
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install
echo "✅ Frontend deps installed"

echo ""
echo "================================"
echo "🌱 To seed the database, run:"
echo "   cd backend && npm run seed"
echo ""
echo "🚀 To start development:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm run dev"
echo ""
echo "🔑 Demo Credentials:"
echo "   Admin: admin@shopwave.com / admin123"
echo "   User:  ritish@example.com / test123"
echo ""
echo "🌐 Open: http://localhost:3000"
echo "================================"
