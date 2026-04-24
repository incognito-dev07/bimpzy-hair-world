var API_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
});

function loadProducts() {
  var grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  grid.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>';
  
  fetch(API_URL + '/products')
    .then(function(res) { return res.json(); })
    .then(function(products) {
      displayProducts(products);
      setupFilters(products);
    })
    .catch(function(err) {
      grid.innerHTML = '<div class="error">Failed to load products</div>';
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
  var buttons = document.querySelectorAll('.add-to-cart-btn');
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

function setupFilters(products) {
  var btns = document.querySelectorAll('.filter-btn');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', (function(btn) {
      return function() {
        var allBtns = document.querySelectorAll('.filter-btn');
        for (var j = 0; j < allBtns.length; j++) {
          allBtns[j].classList.remove('active');
        }
        btn.classList.add('active');
        var cat = btn.getAttribute('data-category');
        if (cat === 'all') {
          displayProducts(products);
        } else {
          var filtered = [];
          for (var k = 0; k < products.length; k++) {
            if (products[k].category === cat) filtered.push(products[k]);
          }
          displayProducts(filtered);
        }
      };
    })(btns[i]));
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