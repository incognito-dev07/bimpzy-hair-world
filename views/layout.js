module.exports = (title, content, pageName) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes">
  <title>${title}</title>
  <meta name="theme-color" content="#d4af37">
  <link rel="icon" type="image/svg+xml" href="/assets/icon.svg">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/core.css">
  <link rel="stylesheet" href="/css/components.css">
  ${pageName === 'admin-dashboard' || pageName === 'admin-login' ? '<link rel="stylesheet" href="/css/admin.css">' : ''}
</head>
<body>
  <div class="app">
    ${pageName !== 'admin-login' && pageName !== 'admin-dashboard' ? `
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <i class="fas fa-cut"></i>
          <span>Bimpzy</span>
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

  <script src="/js/index.js"></script>
  ${pageName !== 'admin-login' && pageName !== 'admin-dashboard' ? '<script src="/js/cart.js"></script>' : ''}
  ${pageName === 'products' ? '<script src="/js/products.js"></script>' : ''}
  ${pageName === 'booking' ? '<script src="/js/booking.js"></script>' : ''}
  ${pageName === 'admin-login' ? '<script src="/js/admin.js"></script>' : ''}
  ${pageName === 'admin-dashboard' ? '<script src="/js/admin.js"></script>' : ''}
</body>
</html>`;
};