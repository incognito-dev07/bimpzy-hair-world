module.exports = () => {
  return `
    <section class="hero">
      <div class="hero-content">
        <h1>Bimpzy Hair World</h1>
        <p>Your trusted destination for premium wigs, professional styling, and expert hair care services in Nigeria.</p>
        <div class="hero-buttons">
          <a href="/products" class="btn btn-primary"><i class="fas fa-shopping-bag"></i> Shop Now</a>
          <a href="/booking" class="btn btn-secondary"><i class="fas fa-calendar-check"></i> Book Appointment</a>
        </div>
      </div>
    </section>

    <section class="services">
      <div class="container">
        <div class="section-header">
          <h2>Our Services</h2>
          <p>Professional hair services tailored to your needs</p>
        </div>
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">
              <i class="fas fa-user-tie"></i>
            </div>
            <h3>Wig Making</h3>
            <p>Custom wigs crafted to your exact measurements, hair texture preference, and style. We use 100% human hair and premium synthetic fibers.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">
              <i class="fas fa-magic"></i>
            </div>
            <h3>Wig Revamping</h3>
            <p>Breathe new life into your old wigs. We restore damaged lace, add new wefts, restyle, deep clean, and repair any issues.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">
              <i class="fas fa-tools"></i>
            </div>
            <h3>Repairs</h3>
            <p>Expert repair services for all types of wigs and hair extensions. We fix torn lace, replace worn-out tracks, and mend broken clips.</p>
          </div>
          <div class="service-card">
            <div class="service-icon">
              <i class="fas fa-paint-brush"></i>
            </div>
            <h3>Hair Styling</h3>
            <p>Professional styling services including braiding, weaving, cutting, and coloring. Our stylists help you achieve your desired look.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-products">
      <div class="container">
        <div class="section-header">
          <h2>Featured Products</h2>
          <p>Shop our most popular items</p>
        </div>
        <div class="products-grid" id="featuredGrid">
          <div class="loading">Loading products...</div>
        </div>
        <div class="view-all">
          <a href="/products" class="btn btn-outline">View All Products <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </section>

    <section class="about-section">
      <div class="container">
        <div class="section-header">
          <h2>About Bimpzy Hair World</h2>
        </div>
        <div class="about-content">
          <p>With years of experience in the hair industry, Bimpzy Hair World has established itself as a trusted name for quality wigs, professional styling, and reliable repair services. We understand that your hair is an expression of your personality, which is why we use only the highest quality materials and techniques to ensure you look and feel your best.</p>
          <p>Whether you need a custom-made wig, a complete hair transformation, or simple repairs to extend the life of your favorite pieces, our expert team is here to help. We pride ourselves on attention to detail, timely delivery, and customer satisfaction.</p>
        </div>
      </div>
    </section>

    <script>
      fetch('/api/products')
        .then(function(res) { return res.json(); })
        .then(function(products) {
          var featured = products.slice(0, 3);
          var grid = document.getElementById('featuredGrid');
          if (grid && featured.length) {
            var html = '';
            for (var i = 0; i < featured.length; i++) {
              var p = featured[i];
              var imageUrl = p.image_data || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
              html += '<div class="product-card">' +
                '<div class="product-image-wrapper">' +
                '<img src="' + imageUrl + '" class="product-image" alt="' + (p.name || 'Product') + '">' +
                '</div>' +
                '<div class="product-info">' +
                '<h3>' + (p.name || 'Product') + '</h3>' +
                '<p>' + ((p.description || '').substring(0, 60)) + '</p>' +
                '<div class="product-price">₦' + parseFloat(p.price || 0).toFixed(2) + '</div>' +
                '<button class="add-to-cart-btn" data-id="' + p.id + '" data-name="' + (p.name || '').replace(/"/g, '&quot;') + '" data-price="' + (p.price || 0) + '">Add to Cart</button>' +
                '</div>' +
                '</div>';
            }
            grid.innerHTML = html;
            
            var buttons = document.querySelectorAll('#featuredGrid .add-to-cart-btn');
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
        })
        .catch(function(err) {
          console.log('Error loading products:', err);
        });
    </script>
  `;
};