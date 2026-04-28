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
          <button class="nav-btn" data-tab="services">
            <i class="fas fa-cut"></i> Services
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
        
        <div id="servicesPanel" class="admin-panel">
          <div class="panel-header">
            <button class="add-btn" id="addServiceBtn">
              <i class="fas fa-plus"></i> Add New Service
            </button>
          </div>
          <div id="servicesContainer" class="products-grid-view"></div>
        </div>
      </div>
    </div>
    
    <div id="productModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="productModalTitle">Add Product</h3>
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
          <input type="number" id="productPrice" step="0.01" min="0" placeholder="0.00" required>
        </div>

        <div class="form-group">
          <label>Product Image *</label>
          <input type="file" id="productImage" accept="image/jpeg,image/png,image/jpg,image/webp">
          <div id="productImagePreview" class="image-preview" style="display:none; margin-top:10px;">
            <img id="productImagePreviewImg" style="max-width:80px; max-height:80px; border-radius:8px;">
          </div>
        </div>
        
        <div class="modal-buttons">
          <button class="btn btn-outline close-modal">Cancel</button>
          <button class="btn btn-primary" id="saveProductBtn">Save Product</button>
        </div>
      </div>
    </div>
    
    <div id="serviceModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="serviceModalTitle">Add Service</h3>
          <button class="close-modal"><i class="fas fa-times"></i></button>
        </div>
        <input type="hidden" id="serviceId">
        
        <div class="form-group">
          <label>Service Name *</label>
          <input type="text" id="serviceName" placeholder="Service name" required>
        </div>
        
        <div class="form-group">
          <label>Description</label>
          <textarea id="serviceDesc" rows="3" placeholder="Service description"></textarea>
        </div>
        
        <div class="form-group">
          <label>Price (₦) *</label>
          <input type="number" id="servicePrice" step="0.01" min="0" placeholder="0.00" required>
        </div>
          
        <div class="form-group">
          <label>Category</label>
          <div class="modal-category-wrapper">
            <div class="modal-category-trigger" id="modalCategoryTrigger">
              <span>Wig Making</span>
              <i class="fas fa-chevron-down"></i>
            </div>
            <div class="modal-category-dropdown" id="modalCategoryDropdown">
              <div class="modal-category-option" data-value="Wig Making">Wig Making</div>
              <div class="modal-category-option" data-value="Wig Revamping">Wig Revamping</div>
              <div class="modal-category-option" data-value="Repairs">Repairs</div>
              <div class="modal-category-option" data-value="Hair Styling">Hair Styling</div>
              <div class="modal-category-option" data-value="Braiding">Braiding</div>
              <div class="modal-category-option" data-value="Consultation">Consultation</div>
              <div class="modal-category-option" data-value="Hair Coloring">Hair Coloring</div>
              <div class="modal-category-option" data-value="Hair Cutting">Hair Cutting</div>
              <div class="modal-category-option" data-value="Hair Extensions">Hair Extensions</div>
              <div class="modal-category-option" data-value="Scalp Treatment">Scalp Treatment</div>
            </div>
            <input type="hidden" id="serviceCategoryHidden" value="Wig Making">
          </div>
        </div>

        <div class="form-group">
          <label>Service Image *</label>
          <input type="file" id="serviceImage" accept="image/jpeg,image/png,image/jpg,image/webp">
          <div id="serviceImagePreview" class="image-preview" style="display:none; margin-top:10px;">
            <img id="serviceImagePreviewImg" style="max-width:80px; max-height:80px; border-radius:8px;">
          </div>
        </div>
        
        <div class="modal-buttons">
          <button class="btn btn-outline close-modal">Cancel</button>
          <button class="btn btn-primary" id="saveServiceBtn">Save Service</button>
        </div>
      </div>
    </div>

    <div id="cropModal" class="modal crop-modal">
      <div class="modal-content crop-modal-content">
        <div class="modal-header">
          <h3>Crop Image</h3>
          <button class="close-crop-modal"><i class="fas fa-times"></i></button>
        </div>
        <div class="crop-image-container">
          <div class="crop-image-wrapper" id="cropImageWrapper"></div>
        </div>
        <div class="crop-controls">
          <button class="btn btn-outline" id="cropCancelBtn">Cancel</button>
          <button class="btn btn-primary" id="cropConfirmBtn">Crop & Save</button>
        </div>
      </div>
    </div>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.13/cropper.min.js"></script>
  `;
};