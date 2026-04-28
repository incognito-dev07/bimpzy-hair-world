var API_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
  loadProductsIntoSlider();
  loadServicesIntoSlider();
});

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
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

function loadProductsIntoSlider() {
  var slider = document.getElementById('productsSlider');
  if (!slider) return;
  
  slider.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>';
  
  fetch(API_URL + '/products')
    .then(function(res) { return res.json(); })
    .then(function(products) {
      var shuffledProducts = shuffleArray(products);
      var html = '';
      for (var i = 0; i < shuffledProducts.length; i++) {
        var p = shuffledProducts[i];
        var imageUrl = p.image_data || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
        html += '<div class="product-card">' +
          '<div class="product-image-wrapper">' +
          '<img src="' + imageUrl + '" class="product-image" alt="' + escapeHtml(p.name) + '">' +
          '</div>' +
          '<div class="product-info">' +
          '<h3>' + escapeHtml(p.name) + '</h3>' +
          '<p>' + escapeHtml((p.description || '').substring(0, 60)) + '</p>' +
          '<div class="product-price">₦' + parseFloat(p.price).toFixed(2) + '</div>' +
          '<button class="add-to-cart-btn" data-id="' + p.id + '" data-name="' + escapeHtml(p.name).replace(/"/g, '&quot;') + '" data-price="' + p.price + '"><i class="fas fa-cart-plus"></i> Add to Cart</button>' +
          '</div>' +
          '</div>';
      }
      slider.innerHTML = html;
      
      var buttons = slider.querySelectorAll('.add-to-cart-btn');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(e) {
          var btn = e.currentTarget;
          var id = parseInt(btn.getAttribute('data-id'));
          var name = btn.getAttribute('data-name');
          var price = parseFloat(btn.getAttribute('data-price'));
          if (window.addToCart) {
            window.addToCart({ id: id, name: name, price: price });
          }
        });
      }
    })
    .catch(function(err) {
      console.error('Failed to load products:', err);
      slider.innerHTML = '<div class="loading">Failed to load products</div>';
    });
}

function loadServicesIntoSlider() {
  var slider = document.getElementById('servicesSlider');
  if (!slider) return;
  
  slider.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading services...</div>';
  
  fetch(API_URL + '/services')
    .then(function(res) { return res.json(); })
    .then(function(services) {
      var shuffledServices = shuffleArray(services);
      var html = '';
      for (var i = 0; i < shuffledServices.length; i++) {
        var s = shuffledServices[i];
        var imageUrl = s.image_data || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
        html += '<div class="product-card">' +
          '<div class="product-image-wrapper">' +
          '<img src="' + imageUrl + '" class="product-image" alt="' + escapeHtml(s.name) + '">' +
          '</div>' +
          '<div class="product-info">' +
          '<h3>' + escapeHtml(s.name) + '</h3>' +
          '<p>' + escapeHtml((s.description || '').substring(0, 60)) + '</p>' +
          '<div class="product-price">₦' + parseFloat(s.price).toFixed(2) + '</div>' +
          '<button class="service-book-btn" data-name="' + escapeHtml(s.name).replace(/"/g, '&quot;') + '"><i class="fas fa-calendar-check"></i> Book Service</button>' +
          '</div>' +
          '</div>';
      }
      slider.innerHTML = html;
      
      var buttons = slider.querySelectorAll('.service-book-btn');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(e) {
          var btn = e.currentTarget;
          var serviceName = btn.getAttribute('data-name');
          window.location.href = '/booking?service=' + encodeURIComponent(serviceName);
        });
      }
    })
    .catch(function(err) {
      console.error('Failed to load services:', err);
      slider.innerHTML = '<div class="loading">Failed to load services</div>';
    });
}