module.exports = () => {
  return `
    <div class="hero-svg-container">
      <img src="/assets/hero.svg" alt="Bimpzy Hair World" class="hero-svg">
    </div>

    <section class="hero">
      <div class="hero-content">
        <p class="hero-description">Premium wigs, professional styling, and expert hair care services trusted across Nigeria.</p>
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
            <div class="service-title">
              <i class="fas fa-user-tie"></i>
              <h3>Wig Making</h3>
            </div>
            <div class="service-content">
              <p>Custom wigs crafted to your exact measurements and style preferences. We use 100% human hair and premium synthetic fibers.</p>
            </div>
          </div>
          <div class="service-card">
            <div class="service-title">
              <i class="fas fa-magic"></i>
              <h3>Wig Revamping</h3>
            </div>
            <div class="service-content">
              <p>Restore damaged lace, add new wefts, deep clean, and restyle your old wigs to look brand new.</p>
            </div>
          </div>
          <div class="service-card">
            <div class="service-title">
              <i class="fas fa-tools"></i>
              <h3>Repairs</h3>
              </div>
            <div class="service-content">
              <p>Fix torn lace, replace worn-out tracks, mend broken clips, and restore damaged wefts quickly.</p>
            </div>
          </div>
          <div class="service-card">
            <div class="service-title">
              <i class="fas fa-paint-brush"></i>
              <h3>Hair Styling</h3>
            </div>
            <div class="service-content">
              <p>Professional braiding, weaving, cutting, and coloring services for any occasion.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-products">
      <div class="container">
        <div class="section-header">
          <h2>Featured Products</h2>
          <p>Explore our popular products and services</p>
        </div>
        <div class="slider-container">
          <button class="slider-arrow prev" onclick="scrollSlider('featuredSlider', -1)"><i class="fas fa-chevron-left"></i></button>
          <div class="slider-wrapper" id="featuredSliderWrapper">
            <div class="products-slider" id="featuredSlider"></div>
          </div>
          <button class="slider-arrow next" onclick="scrollSlider('featuredSlider', 1)"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="view-all">
          <a href="/products" class="btn btn-outline">View All Products <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div class="faq-container">
          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <h3>How long does wig making take?</h3>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              <p>Wig making typically takes 3-7 business days based on the complexity and customization. Rush orders can be completed in 2-3 days with an additional fee.</p>
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <h3>Do you offer virtual consultations?</h3>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              <p>Yes! We offer free virtual consultations via WhatsApp. You can schedule one through our booking page.</p>
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <h3>What payment methods do you accept?</h3>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              <p>We accept bank transfers, mobile money, and cash on delivery. Payment details will be shared upon order confirmation.</p>
            </div>
          </div>
          <div class="faq-item">
            <div class="faq-question" onclick="toggleFaq(this)">
              <h3>Can I send my own hair for styling?</h3>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="faq-answer">
              <p>Absolutely! You can send your own hair for styling, wig making, or revamping. Just mention this when booking your appointment.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <script>
      function scrollSlider(sliderId, direction) {
        var slider = document.getElementById(sliderId);
        if (slider) {
          var scrollAmount = 260;
          slider.scrollLeft += direction * scrollAmount;
        }
      }
      
      function toggleFaq(element) {
        var faqItem = element.closest('.faq-item');
        faqItem.classList.toggle('active');
      }
      
      fetch('/api/products')
        .then(function(res) { return res.json(); })
        .then(function(products) {
          var featured = products.slice(0, 6);
          var slider = document.getElementById('featuredSlider');
          if (slider && featured.length) {
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
            slider.innerHTML = html;
            
            var buttons = document.querySelectorAll('#featuredSlider .add-to-cart-btn');
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
        });
    </script>
  `;
};