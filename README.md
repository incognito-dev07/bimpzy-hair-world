## Bimpzy Hair World - Hair Styling & Wig E-commerce Platform

A full-featured e-commerce platform for hair styling services and wig products, built with Node.js, Express, PostgreSQL, and Cloudinary.

## Live Demo

[Live Site URL](https://bimpzy-hair-world.onrender.com)

## Features

- **Product Management** - Browse and purchase wigs and hair products
- **Service Booking** - Schedule appointments for hair services via WhatsApp
- **Shopping Cart** - Add products to cart and checkout via WhatsApp
- **Admin Dashboard** - Manage products and services with image cropping
- **Image Optimization** - Cloudinary CDN with automatic compression
- **Mobile Responsive** - Fully responsive design for all devices
- **Secure Authentication** - Admin authentication with bcrypt hashing
- **Rate Limiting** - Protection against brute force attacks
- **Lazy Loading** - Images load progressively for better performance

## Quick Start

```bash
# Clone
git clone https://github.com/incognito-dev07/bimpzy-hair-world.git
cd bimpzy-hair-world

# Install
npm install

# Create .env file (see below)
cp .env.example .env

# Run
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Admin credentials
ADMIN_USERNAME=your_username
ADMIN_PASSWORD_HASH=bcrypt_hash_here
ADMIN_KEY=64_char_random_string

# WhatsApp business number (international format, no +)
WHATSAPP_NUMBER=234XXXXXXXXXX

# Supabase PostgreSQL
DATABASE_URL=your_supabase_postgresql-url

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Project Structure

```
bimpzy-hair-world/
├── config/
│   ├── database.js      # PostgreSQL connection
│   ├── cloudinary.js    # Cloudinary configuration
│   ├── auth.js          # Admin authentication
│   └── admin.js         # Admin middleware
├── routes/
│   ├── index.js         # Route mounting
│   ├── products.js      # Product CRUD API
│   ├── services.js      # Service CRUD API
│   └── admin.js         # Admin login API
├── views/
│   ├── layout.js        # Base HTML template
│   ├── index.js         # Home page
│   ├── products.js      # Products & Services page
│   ├── booking.js       # Booking page
│   └── admin/
│       ├── login.js     # Admin login page
│       └── dashboard.js # Admin dashboard
├── public/
│   ├── css/
│   │   ├── core.css     # Base styles
│   │   ├── components.css # Component styles
│   │   └── admin.css    # Admin styles
│   ├── js/
│   │   ├── index.js     # Global scripts
│   │   ├── cart.js      # Shopping cart
│   │   ├── booking.js   # Booking form
│   │   ├── admin.js     # Admin dashboard
│   │   └── toast.js     # Toast notifications
│   └── assets/
│       ├── hero.svg     # Hero illustration
│       └── icon.svg     # Favicon
├── server.js            # Application entry point
├── package.json         # Dependencies
└── README.md            # Documentation
```

### License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

### Credits

Developed by Incognito Dev
