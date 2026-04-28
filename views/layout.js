module.exports = (title, content, pageName, metaDescription = '', metaKeywords = '') => {
  const version = Date.now();
  
  let description = metaDescription;
  let keywords = metaKeywords;
  let ogImage = 'https://bimpzy-hair-world.onrender.com/assets/hero.svg';
  let pageUrl = '';
  
  if (pageName === 'home') {
    description = description || 'Bimpzy Hair World - Premium wigs, professional styling, and expert hair care services in Nigeria. Shop quality hair products and book appointments online.';
    keywords = keywords || 'wigs, hair styling, hair products, wig making, hair salon, Nigeria, hair care, braiding, hair extensions';
    pageUrl = '/';
  } else if (pageName === 'products') {
    description = description || 'Browse our collection of premium wigs and hair products. Find the perfect hair style for any occasion from Bimpzy Hair World.';
    keywords = keywords || 'buy wigs, hair products, wigs for sale, hair accessories, lace front wigs, human hair wigs';
    pageUrl = '/products';
  } else if (pageName === 'booking') {
    description = description || 'Book your hair appointment online at Bimpzy Hair World. Schedule your session with expert stylists for wig making, revamping, and styling.';
    keywords = keywords || 'hair appointment, book hair stylist, wig consultation, hair salon booking, Nigeria hair salon';
    pageUrl = '/booking';
  } else if (pageName === 'admin-login') {
    description = 'Admin login portal for Bimpzy Hair World';
    pageUrl = '/admin/login';
  } else if (pageName === 'admin-dashboard') {
    description = 'Admin dashboard for Bimpzy Hair World';
    pageUrl = '/admin/dashboard';
  }
  
  const fullUrl = `https://bimpzy-hair-world.onrender.com${pageUrl}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="author" content="Bimpzy Hair World">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${fullUrl}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Bimpzy Hair World">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${ogImage}">
  <link rel="canonical" href="${fullUrl}">
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta name="theme-color" content="#d4af37">
  <link rel="icon" type="image/svg+xml" href="/assets/icon.svg">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/core.css?v=${version}">
  <link rel="stylesheet" href="/css/components.css?v=${version}">
  ${pageName === 'admin-dashboard' || pageName === 'admin-login' ? '<link rel="stylesheet" href="/css/admin.css?v=' + version + '">' : ''}
</head>
<body>
  <div class="app">
    ${pageName !== 'admin-login' && pageName !== 'admin-dashboard' ? `
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <img src="/assets/icon.svg" alt="Bimpzy" class="logo-icon">
          <span>Bimzy Hair World</span>
        </div>
        <ul class="nav-links" id="navLinks">
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products & Services</a></li>
          <li><a href="/booking">Book Appointments</a></li>
        </ul>
        <button class="mobile-menu-btn" id="mobileMenuBtn">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </nav>

    <div class="cart-fixed-btn" id="cartIconBtn">
      <i class="fas fa-shopping-cart"></i>
      <span class="cart-count" id="cartCountNav">0</span>
    </div>

    <div class="cart-sidebar" id="cartSidebar">
      <div class="cart-header">
        <h3><i class="fas fa-shopping-cart"></i> Cart</h3>
        <button class="close-cart" id="closeCartBtn"><i class="fas fa-times"></i></button>
      </div>
      <div class="cart-items" id="cartItemsList">
        <p class="empty-cart">Cart is empty</p>
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span id="cartTotal">₦0.00</span>
        </div>
        <button class="whatsapp-order-btn" id="whatsappOrderBtn">
          <i class="fab fa-whatsapp"></i> Send Order
        </button>
      </div>
    </div>

    <div id="sidebarOverlay" class="sidebar-overlay"></div>
    ` : ''}

    <main class="main">
      ${content}
    </main>

    ${pageName !== 'admin-login' && pageName !== 'admin-dashboard' ? `
    <footer class="footer">
      <div class="footer-nav">
        <a href="/">Home</a>
        <span>•</span>
        <a href="/products">Products</a>
        <span>•</span>
        <a href="/booking">Booking</a>
      </div>
      <p>2026 Bimpzy Hair World. All rights reserved.</p>
    </footer>
    ` : ''}
  </div>

  <script src="/js/index.js?v=${version}"></script>
  <script src="/js/toast.js?v=${version}"></script>
  ${pageName !== 'admin-login' && pageName !== 'admin-dashboard' ? '<script src="/js/cart.js?v=' + version + '"></script>' : ''}
  ${pageName === 'booking' ? '<script src="/js/booking.js?v=' + version + '"></script>' : ''}
  ${pageName === 'admin-login' ? '<script src="/js/admin.js?v=' + version + '"></script>' : ''}
  ${pageName === 'admin-dashboard' ? '<script src="/js/admin.js?v=' + version + '"></script>' : ''}
</body>
</html>`;
};