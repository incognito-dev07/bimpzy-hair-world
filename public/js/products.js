var API_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
  loadServices();
});

function loadProducts() {
  var grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  grid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>';
  
  fetch(API_URL + '/products')
    .then(function(res) { return res.json(); })
    .then(function(products) {
      displayProducts(products);
    })
    .catch(function(err) {
      grid.innerHTML = '<div class="error">Failed to load products</div>';
    });
}

function loadServices() {
  var container = document.getElementById('servicesContainer');
  if (!container) return;
  
  container.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading services...</div>';
  
  fetch(API_URL + '/services')
    .then(function(res) { return res.json(); })
    .then(function(services) {
      displayServices(services);
    })
    .catch(function(err) {
      container.innerHTML = '<div class="error">Failed to load services</div>';
    });
}

function displayProducts(products) {
  var grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  if (products.length === 0) {
    grid.innerHTML = '<div class="loading">No products found</div>';
    return;
  }
  
  var html = '';
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var imageUrl = p.image_data || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
    var productName = escapeHtml(p.name);
    var productDesc = escapeHtml(p.description || 'No description available');
    if (productDesc.length > 80) productDesc = productDesc.substring(0, 80) + '...';
    var productPrice = parseFloat(p.price).toFixed(2);
    
    html += '<div class="product-card" data-product-id="' + p.id + '">' +
      '<div class="product-image-wrapper">' +
      '<img src="' + imageUrl + '" class="product-image" alt="' + productName + '">' +
      '</div>' +
      '<div class="product-info">' +
      '<h3>' + productName + '</h3>' +
      '<p>' + productDesc + '</p>' +
      '<div class="product-price">₦' + productPrice + '</div>' +
      '<button class="add-to-cart-btn" data-id="' + p.id + '" data-name="' + productName.replace(/"/g, '&quot;') + '" data-price="' + p.price + '">' +
      '<i class="fas fa-cart-plus"></i> Add to Cart</button>' +
      '</div>' +
      '</div>';
  }
  grid.innerHTML = html;
  
  // Attach event listeners to all add-to-cart buttons
  var buttons = document.querySelectorAll('#productsGrid .add-to-cart-btn');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(e) {
      e.stopPropagation();
      var btn = e.currentTarget;
      var id = parseInt(btn.getAttribute('data-id'));
      var name = btn.getAttribute('data-name');
      var price = parseFloat(btn.getAttribute('data-price'));
      window.addToCart({ id: id, name: name, price: price });
    });
  }
}

function displayServices(services) {
  var container = document.getElementById('servicesContainer');
  if (!container) return;
  
  if (services.length === 0) {
    container.innerHTML = '<div class="loading">No services found</div>';
    return;
  }
  
  var html = '';
  for (var i = 0; i < services.length; i++) {
    var s = services[i];
    var imageUrl = s.image_data || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
    var serviceName = escapeHtml(s.name);
    var serviceDesc = escapeHtml(s.description || 'No description available');
    if (serviceDesc.length > 80) serviceDesc = serviceDesc.substring(0, 80) + '...';
    var servicePrice = parseFloat(s.price).toFixed(2);
    
    html += '<div class="product-card" data-service-id="' + s.id + '">' +
      '<div class="product-image-wrapper">' +
      '<img src="' + imageUrl + '" class="product-image" alt="' + serviceName + '">' +
      '</div>' +
      '<div class="product-info">' +
      '<h3>' + serviceName + '</h3>' +
      '<p>' + serviceDesc + '</p>' +
      '<div class="product-price">₦' + servicePrice + '</div>' +
      '<button class="book-service-btn" data-name="' + serviceName.replace(/"/g, '&quot;') + '">' +
      '<i class="fas fa-calendar-check"></i> Book This Service</button>' +
      '</div>' +
      '</div>';
  }
  container.innerHTML = html;
  
  // Attach event listeners to all book service buttons
  var buttons = document.querySelectorAll('#servicesContainer .book-service-btn');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function(e) {
      var btn = e.currentTarget;
      var serviceName = btn.getAttribute('data-name');
      window.location.href = '/booking?service=' + encodeURIComponent(serviceName);
    });
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