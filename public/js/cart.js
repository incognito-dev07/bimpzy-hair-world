var cart = [];

function loadCart() {
  var saved = localStorage.getItem('bimpzyCart');
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch(e) {
      cart = [];
    }
  }
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('bimpzyCart', JSON.stringify(cart));
  updateCartUI();
}

window.addToCart = function(product) {
  if (!product || !product.id) {
    console.error('Invalid product:', product);
    if (window.showToast) window.showToast('Invalid product', 'error');
    return;
  }
  
  var existingIndex = -1;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === product.id) {
      existingIndex = i;
      break;
    }
  }
  
  if (existingIndex !== -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    cart.push({ 
      id: product.id,
      name: product.name, 
      price: parseFloat(product.price), 
      quantity: 1
    });
  }
  saveCart();
  if (window.showToast) window.showToast(product.name + ' added to cart!', 'success');
};

function updateQuantity(id, newQty) {
  if (newQty <= 0) {
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id !== id) {
        newCart.push(cart[i]);
      }
    }
    cart = newCart;
  } else {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === id) {
        cart[i].quantity = newQty;
        break;
      }
    }
  }
  saveCart();
}

function removeFromCart(id) {
  var newCart = [];
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id !== id) {
      newCart.push(cart[i]);
    }
  }
  cart = newCart;
  saveCart();
  if (window.showToast) window.showToast('Item removed from cart', 'info');
}

function getCartTotal() {
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    total += cart[i].price * cart[i].quantity;
  }
  return total;
}

function updateCartUI() {
  var counters = document.querySelectorAll('.cart-count');
  var totalItems = 0;
  for (var i = 0; i < cart.length; i++) {
    totalItems += cart[i].quantity;
  }
  for (var i = 0; i < counters.length; i++) {
    counters[i].textContent = totalItems;
  }
  
  var container = document.getElementById('cartItemsList');
  var totalSpan = document.getElementById('cartTotal');
  
  if (container) {
    if (cart.length === 0) {
      container.innerHTML = '<p class="empty-cart"><i class="fas fa-shopping-basket"></i> Your cart is empty</p>';
    } else {
      var html = '';
      for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        html += '<div class="cart-item">' +
          '<div class="cart-item-info">' +
          '<h4>' + escapeHtml(item.name) + '</h4>' +
          '<span class="cart-item-price">₦' + item.price.toFixed(2) + '</span>' +
          '</div>' +
          '<div class="cart-item-quantity">' +
          '<button onclick="updateQuantity(' + item.id + ', ' + (item.quantity - 1) + ')">-</button>' +
          '<span>' + item.quantity + '</span>' +
          '<button onclick="updateQuantity(' + item.id + ', ' + (item.quantity + 1) + ')">+</button>' +
          '<button onclick="removeFromCart(' + item.id + ')"><i class="fas fa-trash" style="color: var(--accent-danger)"></i></button>' +
          '</div>' +
          '</div>';
      }
      container.innerHTML = html;
    }
  }
  
  if (totalSpan) {
    totalSpan.textContent = '₦' + getCartTotal().toFixed(2);
  }
}

function sendOrderToWhatsApp() {
  if (cart.length === 0) {
    if (window.showToast) window.showToast('Your cart is empty', 'error');
    return;
  }
  
  var msg = "BIMPZY HAIR WORLD ORDER\n\n";
  msg += "Order Details:\n";
  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    msg += item.name + " x" + item.quantity + " = ₦" + (item.price * item.quantity).toFixed(2) + "\n";
  }
  msg += "\nTotal: ₦" + getCartTotal().toFixed(2) + "\n\n";
  msg += "Please confirm availability and share payment details.";
  
  var whatsappNumber = getWhatsAppNumber();
  var url = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(msg);
  window.open(url, '_blank');
}

function toggleCart() {
  var sidebar = document.getElementById('cartSidebar');
  var overlay = document.getElementById('sidebarOverlay');
  if (sidebar) {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
    if (sidebar.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function closeCart() {
  var sidebar = document.getElementById('cartSidebar');
  var overlay = document.getElementById('sidebarOverlay');
  if (sidebar) {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadCart();
  
  var cartBtn = document.getElementById('cartIconBtn');
  var closeBtn = document.getElementById('closeCartBtn');
  var whatsappBtn = document.getElementById('whatsappOrderBtn');
  var overlay = document.getElementById('sidebarOverlay');
  
  if (cartBtn) cartBtn.addEventListener('click', toggleCart);
  if (closeBtn) closeBtn.addEventListener('click', closeCart);
  if (whatsappBtn) whatsappBtn.addEventListener('click', sendOrderToWhatsApp);
  if (overlay) overlay.addEventListener('click', closeCart);
});

window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;