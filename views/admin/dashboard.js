module.exports = () => {
  return `
    <div class="admin-dashboard">
      <div class="admin-sidebar">
        <div class="sidebar-header">
          <i class="fas fa-crown"></i>
          <h3>Bimpzy Admin</h3>
        </div>
        <nav class="sidebar-nav">
          <button class="nav-btn active" data-tab="products">
            <i class="fas fa-box"></i> Products
          </button>
          <button class="nav-btn" data-tab="bookings">
            <i class="fas fa-calendar-check"></i> Bookings
          </button>
        </nav>
        <button class="logout-btn" id="logoutBtn">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
      
      <div class="admin-content">
        <div class="content-header">
          <h1 id="contentTitle">Products Management</h1>
        </div>
        
        <div id="productsPanel" class="admin-panel active">
          <div class="panel-header">
            <button class="add-btn" id="addProductBtn">
              <i class="fas fa-plus"></i> Add New Product
            </button>
          </div>
          <div id="productsContainer" class="products-grid-view"></div>
        </div>
        
        <div id="bookingsPanel" class="admin-panel">
          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Date & Time</th>
                  <th>Service</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="bookingsTableBody">
                <tr><td colspan="4" style="text-align:center;">Loading...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
    <div id="productModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modalTitle">Add Product</h3>
          <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <input type="hidden" id="productId">
        
        <div class="form-group">
          <label>Product Name *</label>
          <input type="text" id="productName" placeholder="Product name" required>
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <textarea id="productDesc" rows="3" placeholder="Product description"></textarea>
        </div>
        
        <div class="form-group">
          <label>Price (₦) *</label>
          <input type="number" id="productPrice" step="0.01" placeholder="0.00" required>
        </div>
          
        <div class="form-group">
          <label>Category</label>
          <div class="modal-category-wrapper">
            <div class="modal-category-trigger" id="modalCategoryTrigger">
              <span>Wigs</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="modal-category-dropdown" id="modalCategoryDropdown">
              <div class="modal-category-option" data-value="wigs">Wigs</div>
              <div class="modal-category-option" data-value="styling">Styling</div>
              <div class="modal-category-option" data-value="repair">Repair & Revamp</div>
            </div>
            <input type="hidden" id="productCategoryHidden" value="wigs">
          </div>
        </div>

        <div class="form-group">
          <label>Product Image *</label>
          <input type="file" id="productImage" accept="image/jpeg,image/png,image/jpg,image/webp">
          <div id="currentImagePreview" class="image-preview" style="display:none; margin-top:10px;">
            <img id="imagePreview" style="max-width:80px; max-height:80px; border-radius:8px;">
          </div>
        </div>
        
        <div class="modal-buttons">
          <button class="btn btn-outline close-modal">Cancel</button>
          <button class="btn btn-primary" id="saveProductBtn">Save Product</button>
        </div>
      </div>
    </div>
  `;
};