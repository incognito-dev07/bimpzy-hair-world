module.exports = () => {
  return `
    <div class="products-page">
      <div class="products-hero">
        <div class="container">
          <h1>Our Products & Services</h1>
          <p>Premium quality wigs, styling, and hair care services</p>
        </div>
      </div>

      <div class="container" id="productsContainer"></div>
    </div>

    <script>
      function scrollCategorySlider(sliderId, direction) {
        var slider = document.getElementById(sliderId);
        if (slider) {
          var scrollAmount = 260;
          slider.scrollLeft += direction * scrollAmount;
        }
      }
      
      function displayCategoryProducts(categoryName, products) {
        var container = document.getElementById('productsContainer');
        if (!container) return;
        
        var categoryDiv = document.createElement('div');
        categoryDiv.className = 'category-section';
        
        var title = document.createElement('h3');
        title.className = 'category-title';
        title.innerHTML = categoryName;
        categoryDiv.appendChild(title);
        
        var sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        
        var prevBtn = document.createElement('button');
        prevBtn.className = 'slider-arrow prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        var sliderId = 'slider_' + categoryName.replace(/\\s/g, '_');
        prevBtn.onclick = function() { scrollCategorySlider(sliderId, -1); };
        
        var nextBtn = document.createElement('button');
        nextBtn.className = 'slider-arrow next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.onclick = function() { scrollCategorySlider(sliderId, 1); };
        
        var wrapper = document.createElement('div');
        wrapper.className = 'slider-wrapper';
        
        var slider = document.createElement('div');
        slider.className = 'products-slider';
        slider.id = sliderId;
        
        var html = '';
        for (var i = 0; i < products.length; i++) {
          var p = products[i];
          var imageUrl = p.image_data || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
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
        
        wrapper.appendChild(slider);
        sliderContainer.appendChild(prevBtn);
        sliderContainer.appendChild(wrapper);
        sliderContainer.appendChild(nextBtn);
        categoryDiv.appendChild(sliderContainer);
        container.appendChild(categoryDiv);
        
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
      
      function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, function(m) {
          if (m === '&') return '&amp;';
          if (m === '<') return '&lt;';
          if (m === '>') return '&gt;';
          return m;
        });
      }
      
      fetch('/api/products')
        .then(function(res) { return res.json(); })
        .then(function(products) {
          var wigs = products.filter(function(p) { return p.category === 'wigs'; });
          var styling = products.filter(function(p) { return p.category === 'styling'; });
          var repair = products.filter(function(p) { return p.category === 'repair'; });
          
          if (wigs.length) displayCategoryProducts('Wigs', wigs);
          if (styling.length) displayCategoryProducts('Styling', styling);
          if (repair.length) displayCategoryProducts('Repair & Revamp', repair);
        });
    </script>
  `;
};