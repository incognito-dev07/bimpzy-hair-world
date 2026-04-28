module.exports = () => {
  return `
    <div class="products-page">
      <div class="products-hero">
        <div class="container">
          <h1>Our Products & Services</h1>
          <p>Premium quality wigs and professional hair services</p>
        </div>
      </div>

      <div class="container">
        <div class="category-section">
          <h3 class="category-title">Products</h3>
          <div class="slider-container">
            <button class="slider-arrow prev" onclick="scrollSlider('productsSlider', -1)"><i class="fas fa-chevron-left"></i></button>
            <div class="slider-wrapper">
              <div class="products-slider" id="productsSlider"></div>
            </div>
            <button class="slider-arrow next" onclick="scrollSlider('productsSlider', 1)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>

        <div class="category-section">
          <h3 class="category-title">Services</h3>
          <div class="slider-container">
            <button class="slider-arrow prev" onclick="scrollSlider('servicesSlider', -1)"><i class="fas fa-chevron-left"></i></button>
            <div class="slider-wrapper">
              <div class="products-slider" id="servicesSlider"></div>
            </div>
            <button class="slider-arrow next" onclick="scrollSlider('servicesSlider', 1)"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>
    </div>

    <script>
      function scrollSlider(sliderId, direction) {
        var slider = document.getElementById(sliderId);
        if (slider) {
          var scrollAmount = 260;
          slider.scrollLeft += direction * scrollAmount;
        }
      }
      
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
        fetch('/api/products')
          .then(function(res) { return res.json(); })
          .then(function(products) {
            var shuffledProducts = shuffleArray(products);
            var slider = document.getElementById('productsSlider');
            if (slider) {
              var html = '';
              for (var i = 0; i < shuffledProducts.length; i++) {
                var p = shuffledProducts[i];
                var imageUrl = p.image_url || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
                html += '<div class="product-card">' +
                  '<div class="product-image-wrapper">' +
                  '<img src="' + imageUrl + '" class="product-image" alt="' + escapeHtml(p.name) + '">' +
                  '</div>' +
                  '<div class="product-info">' +
                  '<h3>' + escapeHtml(p.name) + '</h3>' +
                  '<p>' + escapeHtml((p.description || '').substring(0, 60)) + '</p>' +
                  '<div class="product-price">₦' + parseFloat(p.price).toFixed(2) + '</div>' +
                  '<button class="add-to-cart-btn" data-id="' + p.id + '" data-name="' + escapeHtml(p.name).replace(/"/g, '&quot;') + '" data-price="' + p.price + '">Add to Cart</button>' +
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
                  window.addToCart({ id: id, name: name, price: price });
                });
              }
            }
          }).catch(function(err) {
            console.error('Failed to load products:', err);
            var slider = document.getElementById('productsSlider');
            if (slider) {
              slider.innerHTML = '<div class="loading">Failed to load products</div>';
            }
          });
      }
      
      function loadServicesIntoSlider() {
        fetch('/api/services')
          .then(function(res) { return res.json(); })
          .then(function(services) {
            var shuffledServices = shuffleArray(services);
            var slider = document.getElementById('servicesSlider');
            if (slider) {
              var html = '';
              for (var i = 0; i < shuffledServices.length; i++) {
                var s = shuffledServices[i];
                var imageUrl = s.image_url || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
                html += '<div class="product-card">' +
                  '<div class="product-image-wrapper">' +
                  '<img src="' + imageUrl + '" class="product-image" alt="' + escapeHtml(s.name) + '">' +
                  '</div>' +
                  '<div class="product-info">' +
                  '<h3>' + escapeHtml(s.name) + '</h3>' +
                  '<p>' + escapeHtml((s.description || '').substring(0, 60)) + '</p>' +
                  '<div class="product-price">₦' + parseFloat(s.price).toFixed(2) + '</div>' +
                  '<button class="service-book-btn" data-name="' + escapeHtml(s.name).replace(/"/g, '&quot;') + '">Book Service</button>' +
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
            }
          }).catch(function(err) {
            console.error('Failed to load services:', err);
            var slider = document.getElementById('servicesSlider');
            if (slider) {
              slider.innerHTML = '<div class="loading">Failed to load services</div>';
            }
          });
      }
      
      window.scrollSlider = scrollSlider;
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          loadProductsIntoSlider();
          loadServicesIntoSlider();
        });
      } else {
        loadProductsIntoSlider();
        loadServicesIntoSlider();
      }
    </script>
  `;
};