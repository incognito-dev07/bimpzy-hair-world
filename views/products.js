module.exports = () => {
  return `
    <div class="products-page">
      <div class="products-hero">
        <div class="container">
          <h1>Our Products & Services</h1>
          <p>Premium quality wigs, styling, and hair care services</p>
        </div>
      </div>

      <div class="container">
        <div class="products-filter">
          <button class="filter-btn active" data-category="all">All Products</button>
          <button class="filter-btn" data-category="wigs">Wigs</button>
          <button class="filter-btn" data-category="styling">Styling</button>
          <button class="filter-btn" data-category="repair">Repair & Revamp</button>
        </div>

        <div class="products-grid" id="productsGrid">
          <div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading products...</div>
        </div>
      </div>
    </div>
  `;
};