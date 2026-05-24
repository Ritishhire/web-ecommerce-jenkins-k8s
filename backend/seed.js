const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const products = [
  // Electronics
  { name: 'iPhone 15 Pro Max', description: 'Apple\'s flagship smartphone with A17 Pro chip, titanium design, 48MP camera system, and Dynamic Island. 256GB storage.', price: 134900, originalPrice: 149900, category: 'Electronics', brand: 'Apple', stock: 25, isFeatured: true, ratings: 4.8, numReviews: 234, images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'], tags: ['smartphone', 'apple', 'iphone', '5g'] },
  { name: 'Samsung Galaxy S24 Ultra', description: 'Android powerhouse with Snapdragon 8 Gen 3, 200MP camera, built-in S Pen, and 6.8" QHD+ display.', price: 124999, originalPrice: 134999, category: 'Electronics', brand: 'Samsung', stock: 30, isFeatured: true, ratings: 4.7, numReviews: 189, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'], tags: ['smartphone', 'samsung', 'android', '5g'] },
  { name: 'MacBook Pro 14" M3', description: 'Apple M3 Pro chip, 16GB RAM, 512GB SSD, Liquid Retina XDR display, 18-hour battery life. Perfect for professionals.', price: 199900, originalPrice: 219900, category: 'Electronics', brand: 'Apple', stock: 15, isFeatured: true, ratings: 4.9, numReviews: 156, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'], tags: ['laptop', 'apple', 'macbook', 'M3'] },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation, 30-hour battery, touch controls, HD voice calls with 8 microphones.', price: 26990, originalPrice: 34990, category: 'Electronics', brand: 'Sony', stock: 50, isFeatured: false, ratings: 4.6, numReviews: 312, images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'], tags: ['headphones', 'sony', 'wireless', 'anc'] },
  { name: 'iPad Pro 11" M2', description: 'Apple M2 chip, Liquid Retina display, Wi-Fi 6E, USB-C with Thunderbolt 4, works with Apple Pencil (2nd gen).', price: 81900, originalPrice: 89900, category: 'Electronics', brand: 'Apple', stock: 20, ratings: 4.7, numReviews: 98, images: ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400'], tags: ['tablet', 'apple', 'ipad', 'M2'] },
  { name: 'Dell XPS 15 Laptop', description: 'Intel Core i9-13900H, RTX 4060, 32GB RAM, 1TB NVMe SSD, 15.6" 4K OLED touch display.', price: 159990, originalPrice: 179990, category: 'Electronics', brand: 'Dell', stock: 12, ratings: 4.5, numReviews: 87, images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400'], tags: ['laptop', 'dell', 'gaming', 'intel'] },
  { name: 'Canon EOS R8 Camera', description: '24.2MP Full-Frame CMOS sensor, 4K video, Dual Pixel CMOS AF II, compact mirrorless design for enthusiasts.', price: 124995, originalPrice: 139995, category: 'Electronics', brand: 'Canon', stock: 8, ratings: 4.6, numReviews: 45, images: ['https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=400'], tags: ['camera', 'canon', 'mirrorless', 'photography'] },
  { name: 'Samsung 65" QLED 4K TV', description: 'Quantum HDR, 120Hz refresh rate, Smart TV with Tizen OS, Gaming Hub, and Object Tracking Sound.', price: 89990, originalPrice: 109990, category: 'Electronics', brand: 'Samsung', stock: 10, ratings: 4.5, numReviews: 123, images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=400'], tags: ['tv', 'samsung', 'qled', '4k'] },

  // Fashion
  { name: 'Nike Air Max 270', description: 'Iconic Air cushioning with 270-degree heel Air unit. Engineered mesh upper for breathability and support.', price: 10995, originalPrice: 13995, category: 'Fashion', brand: 'Nike', stock: 80, isFeatured: true, ratings: 4.4, numReviews: 445, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], tags: ['shoes', 'nike', 'sneakers', 'running'] },
  { name: 'Levi\'s 511 Slim Jeans', description: 'Classic slim fit jeans in authentic Levi\'s denim. Sits below waist, slim through thigh and leg opening.', price: 3299, originalPrice: 4499, category: 'Fashion', brand: 'Levi\'s', stock: 120, ratings: 4.3, numReviews: 678, images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'], tags: ['jeans', 'denim', 'levis', 'casual'] },
  { name: 'Ray-Ban Aviator Sunglasses', description: 'Iconic gold-tone metal frame with crystal green lenses. UV400 protection. Timeless aviator style.', price: 8490, originalPrice: 9999, category: 'Fashion', brand: 'Ray-Ban', stock: 40, ratings: 4.6, numReviews: 234, images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'], tags: ['sunglasses', 'rayban', 'aviator', 'uv400'] },
  { name: 'Adidas Ultraboost 23', description: 'Boost midsole cushioning, Primeknit+ upper, Continental rubber outsole. Built for runners, loved by all.', price: 12999, originalPrice: 16999, category: 'Fashion', brand: 'Adidas', stock: 60, ratings: 4.5, numReviews: 389, images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400'], tags: ['shoes', 'adidas', 'running', 'boost'] },
  { name: 'Allen Solly Formal Shirt', description: 'Premium cotton formal shirt, slim fit, wrinkle-resistant fabric. Perfect for office wear and occasions.', price: 1299, originalPrice: 2299, category: 'Fashion', brand: 'Allen Solly', stock: 200, ratings: 4.2, numReviews: 567, images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400'], tags: ['shirt', 'formal', 'cotton', 'office'] },

  // Home & Living
  { name: 'Dyson V15 Detect Vacuum', description: 'Laser dust detection, LCD screen showing particle count, 60-min runtime, HEPA filtration. The future of cleaning.', price: 62900, originalPrice: 74900, category: 'Home & Living', brand: 'Dyson', stock: 18, isFeatured: true, ratings: 4.7, numReviews: 156, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'], tags: ['vacuum', 'dyson', 'cordless', 'cleaning'] },
  { name: 'Instant Pot Duo 7-in-1', description: 'Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker & warmer. 6-quart capacity.', price: 8499, originalPrice: 12999, category: 'Home & Living', brand: 'Instant Pot', stock: 35, ratings: 4.6, numReviews: 892, images: ['https://images.unsplash.com/photo-1585515656277-b7b3f98a28c9?w=400'], tags: ['pressure cooker', 'kitchen', 'cooking', 'instant pot'] },
  { name: 'IKEA MALM Bed Frame King', description: 'Clean-line design with under-bed storage drawers. Solid wood veneer surface. Easy assembly with included tools.', price: 29999, originalPrice: 35999, category: 'Home & Living', brand: 'IKEA', stock: 8, ratings: 4.3, numReviews: 234, images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'], tags: ['bed', 'furniture', 'bedroom', 'storage'] },
  { name: 'Philips Hue Starter Kit', description: 'Smart LED bulbs with 16 million colors, voice control, app control, works with Alexa & Google Home. 3-bulb kit.', price: 11990, originalPrice: 14990, category: 'Home & Living', brand: 'Philips', stock: 45, ratings: 4.5, numReviews: 312, images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=400'], tags: ['smart home', 'lights', 'philips', 'iot'] },

  // Sports
  { name: 'Yonex Duora 10 Badminton Racket', description: 'Dual-frame technology, stiff shaft, optimized for both attack and defense. PU synthetic grip included.', price: 12999, originalPrice: 15999, category: 'Sports', brand: 'Yonex', stock: 30, isFeatured: false, ratings: 4.7, numReviews: 145, images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=400'], tags: ['badminton', 'racket', 'yonex', 'sports'] },
  { name: 'Decathlon Fitness Mat', description: 'Extra thick 10mm yoga/fitness mat, non-slip surface, carrying strap included. 183x61cm.', price: 1999, originalPrice: 2999, category: 'Sports', brand: 'Decathlon', stock: 100, ratings: 4.4, numReviews: 678, images: ['https://images.unsplash.com/photo-1601925228558-0e4aba4fffc7?w=400'], tags: ['yoga', 'fitness', 'mat', 'exercise'] },
  { name: 'Garmin Forerunner 965', description: 'Premium GPS running smartwatch, AMOLED display, training readiness, HRV status, 31-day battery.', price: 64990, originalPrice: 72990, category: 'Sports', brand: 'Garmin', stock: 15, ratings: 4.8, numReviews: 89, images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400'], tags: ['smartwatch', 'garmin', 'running', 'gps'] },
  { name: 'Nivia Storm Football', description: 'FIFA-approved match ball, 32-panel hand-stitched design, butyl bladder for excellent air retention. Size 5.', price: 1599, originalPrice: 2199, category: 'Sports', brand: 'Nivia', stock: 75, ratings: 4.3, numReviews: 234, images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400'], tags: ['football', 'soccer', 'nivia', 'outdoor'] },

  // Books
  { name: 'Atomic Habits by James Clear', description: 'An easy & proven way to build good habits & break bad ones. #1 New York Times bestseller with 10M+ copies sold.', price: 499, originalPrice: 799, category: 'Books', brand: 'Penguin', stock: 200, ratings: 4.9, numReviews: 2345, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400'], tags: ['self-help', 'habits', 'productivity', 'bestseller'] },
  { name: 'Rich Dad Poor Dad', description: 'Robert Kiyosaki\'s personal finance classic. What the rich teach their kids about money that the poor and middle class do not.', price: 349, originalPrice: 595, category: 'Books', brand: 'Warner Books', stock: 150, ratings: 4.6, numReviews: 3456, images: ['https://images.unsplash.com/photo-1592496001020-d31bd830651f?w=400'], tags: ['finance', 'investing', 'kiyosaki', 'money'] },
  { name: 'The Psychology of Money', description: 'Morgan Housel explores the strange ways people think about money in 19 short stories. Timeless lessons about wealth and happiness.', price: 399, originalPrice: 699, category: 'Books', brand: 'Jaico', stock: 180, ratings: 4.8, numReviews: 1678, images: ['https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400'], tags: ['finance', 'psychology', 'money', 'investing'] },

  // Beauty
  { name: 'Lakme Absolute Skin Natural Mousse', description: 'Lightweight SPF 8 foundation mousse, skin-perfecting formula, 24-hour hydration. 6 shades available.', price: 699, originalPrice: 999, category: 'Beauty', brand: 'Lakme', stock: 90, ratings: 4.2, numReviews: 456, images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'], tags: ['foundation', 'makeup', 'lakme', 'skincare'] },
  { name: 'The Ordinary Niacinamide 10%', description: 'High-strength vitamin and mineral blemish formula. Reduces appearance of blemishes and congestion. 30ml.', price: 999, originalPrice: 1299, category: 'Beauty', brand: 'The Ordinary', stock: 120, ratings: 4.7, numReviews: 789, images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400'], tags: ['serum', 'skincare', 'niacinamide', 'blemish'] },
  { name: 'Biotique Bio Papaya Face Wash', description: 'Tan removal face wash with papaya extracts. Gently removes dead skin cells, brightens complexion. 150ml.', price: 249, originalPrice: 349, category: 'Beauty', brand: 'Biotique', stock: 200, ratings: 4.1, numReviews: 1234, images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400'], tags: ['facewash', 'skincare', 'biotique', 'papaya'] },

  // Grocery
  { name: 'Tata Tea Gold 500g', description: 'Premium whole leaf tea sourced from Assam gardens. Rich taste, refreshing aroma. Enough for 250 cups.', price: 279, originalPrice: 325, category: 'Grocery', brand: 'Tata', stock: 500, ratings: 4.5, numReviews: 2345, images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'], tags: ['tea', 'tata', 'beverage', 'assam'] },
  { name: 'Amul Pure Ghee 1L', description: 'Made from fresh cream, natural Desi Ghee. Traditional recipe, rich flavour, high smoke point. 1 litre tin.', price: 599, originalPrice: 650, category: 'Grocery', brand: 'Amul', stock: 300, ratings: 4.7, numReviews: 1890, images: ['https://images.unsplash.com/photo-1631203408024-f5c4f1fc7e9d?w=400'], tags: ['ghee', 'amul', 'dairy', 'cooking'] },
  { name: 'Saffola Gold Oil 5L', description: 'Blended edible oil with rice bran and corn oil. Rich in MUFA, good for heart health. 5 litre jerry can.', price: 1199, originalPrice: 1399, category: 'Grocery', brand: 'Saffola', stock: 150, ratings: 4.3, numReviews: 876, images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'], tags: ['oil', 'saffola', 'cooking', 'health'] }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shopwave.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('Admin created: admin@shopwave.com / admin123');

    // Create test user
    await User.create({
      name: 'Ritish Shah',
      email: 'ritish@example.com',
      password: 'test123',
      role: 'user'
    });
    console.log('Test user created: ritish@example.com / test123');

    // Seed products
    const seededProducts = products.map(p => ({ ...p, createdBy: admin._id }));
    await Product.insertMany(seededProducts);
    console.log(`✅ ${products.length} products seeded!`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('Admin: admin@shopwave.com | admin123');
    console.log('User:  ritish@example.com | test123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
