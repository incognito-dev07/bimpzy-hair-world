var API_URL = '/api';
var adminKey = null;

// Cropper instances
var activeCropper = null;
var currentCropType = null;
var currentFileToCrop = null;

// Custom Confirm Modal
window.customConfirm = function(message, onConfirm) {
  var overlay = document.createElement('div');
  overlay.className = 'custom-confirm-overlay';
  overlay.innerHTML = `
    <div class="custom-confirm-modal">
      <div class="service-title">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Confirm Action</h3>
      </div>
      <p>${message}</p>
      <div class="modal-buttons">
        <button class="confirm-no btn btn-outline">Cancel</button>
        <button class="confirm-yes btn btn-primary">Confirm</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  
  setTimeout(function() {
    overlay.classList.add('show');
  }, 10);
  
  function removeOverlay() {
    overlay.classList.remove('show');
    setTimeout(function() {
      overlay.remove();
    }, 300);
  }
  
  overlay.querySelector('.confirm-yes').onclick = function() {
    removeOverlay();
    onConfirm();
  };
  
  overlay.querySelector('.confirm-no').onclick = function() {
    removeOverlay();
  };
  
  overlay.onclick = function(e) {
    if (e.target === overlay) {
      removeOverlay();
    }
  };
};

function toggleMobileMenu() {
  var sidebar = document.querySelector('.admin-sidebar');
  var overlay = document.getElementById('adminSidebarOverlay');
  if (sidebar) {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
    if (sidebar.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

function closeMobileMenu() {
  var sidebar = document.querySelector('.admin-sidebar');
  var overlay = document.getElementById('adminSidebarOverlay');
  if (sidebar) {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

function addMobileMenuButton() {
  if (document.querySelector('.mobile-admin-menu-btn')) return;
  var btn = document.createElement('button');
  btn.className = 'mobile-admin-menu-btn';
  btn.innerHTML = '<i class="fas fa-bars"></i>';
  btn.onclick = toggleMobileMenu;
  document.body.insertBefore(btn, document.body.firstChild);
  
  var overlay = document.createElement('div');
  overlay.id = 'adminSidebarOverlay';
  overlay.className = 'sidebar-overlay';
  overlay.onclick = closeMobileMenu;
  document.body.appendChild(overlay);
}

function showCropModal(file, type) {
  currentCropType = type;
  currentFileToCrop = file;
  var cropModal = document.getElementById('cropModal');
  var cropWrapper = document.getElementById('cropImageWrapper');
  
  var reader = new FileReader();
  reader.onload = function(event) {
    cropWrapper.innerHTML = '<img id="cropImage" src="' + event.target.result + '" style="max-width:100%;">';
    cropModal.style.display = 'flex';
    
    setTimeout(function() {
      var cropImage = document.getElementById('cropImage');
      if (activeCropper) {
        activeCropper.destroy();
      }
      activeCropper = new Cropper(cropImage, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        cropBoxMovable: true,
        cropBoxResizable: true,
        background: false,
        modal: true,
        guides: true,
        center: true,
        autoCropArea: 1,
        responsive: true,
        restore: true
      });
    }, 100);
  };
  reader.readAsDataURL(file);
}

function closeCropModal() {
  var cropModal = document.getElementById('cropModal');
  cropModal.style.display = 'none';
  if (activeCropper) {
    activeCropper.destroy();
    activeCropper = null;
  }
  currentCropType = null;
  currentFileToCrop = null;
}

// Admin Login Page
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    var btn = e.target.querySelector('.login-btn');
    var originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    btn.disabled = true;
    
    try {
      var res = await fetch(API_URL + '/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      });
      var data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminKey', data.adminKey);
        window.location.href = '/admin/dashboard';
      } else {
        if (window.showToast) window.showToast('Invalid username or password', 'error');
      }
    } catch (err) {
      if (window.showToast) window.showToast('Login failed. Please try again.', 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

function loadProducts() {
  fetch(API_URL + '/products')
    .then(function(res) { return res.json(); })
    .then(function(products) {
      var container = document.getElementById('productsContainer');
      if (!container) return;
      
      var html = '';
      for (var i = 0; i < products.length; i++) {
        var p = products[i];
        var imageUrl = p.image_url || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
        
        html += '<div class="product-admin-card">' +
          '<div class="product-admin-top">' +
          '<img src="' + imageUrl + '" class="product-admin-image" alt="' + escapeHtml(p.name) + '">' +
          '<div class="product-admin-info">' +
          '<div class="product-admin-name">' + escapeHtml(p.name) + '</div>' +
          '<div class="product-admin-price">₦' + parseFloat(p.price).toFixed(2) + '</div>' +
          '</div>' +
          '</div>' +
          '<div class="product-admin-bottom">' +
          '<span class="product-admin-category">Product</span>' +
          '<div class="admin-actions">' +
          '<button class="edit-product-btn" onclick="editProduct(' + p.id + ')"><i class="fas fa-edit"></i></button>' +
          '<button class="delete-product-btn" onclick="deleteProduct(' + p.id + ')"><i class="fas fa-trash"></i></button>' +
          '</div>' +
          '</div>' +
          '</div>';
      }
      
      if (products.length === 0) {
        container.innerHTML = '<div class="loading">No products found. Click "Add New Product" to get started.</div>';
      } else {
        container.innerHTML = html;
      }
    })
    .catch(function(err) {
      console.error('Error loading products:', err);
    });
}

function loadServices() {
  fetch(API_URL + '/services')
    .then(function(res) { return res.json(); })
    .then(function(services) {
      var container = document.getElementById('servicesContainer');
      if (!container) return;
      
      var html = '';
      for (var i = 0; i < services.length; i++) {
        var s = services[i];
        var imageUrl = s.image_url || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
        
        html += '<div class="product-admin-card">' +
          '<div class="product-admin-top">' +
          '<img src="' + imageUrl + '" class="product-admin-image" alt="' + escapeHtml(s.name) + '">' +
          '<div class="product-admin-info">' +
          '<div class="product-admin-name">' + escapeHtml(s.name) + '</div>' +
          '<div class="product-admin-price">₦' + parseFloat(s.price).toFixed(2) + '</div>' +
          '</div>' +
          '</div>' +
          '<div class="product-admin-bottom">' +
          '<span class="product-admin-category">' + escapeHtml(s.category || 'Service') + '</span>' +
          '<div class="admin-actions">' +
          '<button class="edit-product-btn" onclick="editService(' + s.id + ')"><i class="fas fa-edit"></i></button>' +
          '<button class="delete-product-btn" onclick="deleteService(' + s.id + ')"><i class="fas fa-trash"></i></button>' +
          '</div>' +
          '</div>' +
          '</div>';
      }
      
      if (services.length === 0) {
        container.innerHTML = '<div class="loading">No services found. Click "Add New Service" to get started.</div>';
      } else {
        container.innerHTML = html;
      }
    })
    .catch(function(err) {
      console.error('Error loading services:', err);
    });
}

function showAddProductModal() {
  document.getElementById('productModalTitle').textContent = 'Add Product';
  document.getElementById('productId').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('productDesc').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productImage').value = '';
  document.getElementById('productImagePreview').style.display = 'none';
  document.getElementById('productModal').style.display = 'flex';
}

function editProduct(id) {
  fetch(API_URL + '/products/' + id)
    .then(function(res) { return res.json(); })
    .then(function(product) {
      document.getElementById('productModalTitle').textContent = 'Edit Product';
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productDesc').value = product.description || '';
      document.getElementById('productPrice').value = product.price;
      
      if (product.image_url) {
        var preview = document.getElementById('productImagePreviewImg');
        var container = document.getElementById('productImagePreview');
        if (preview && container) {
          preview.src = product.image_url;
          container.style.display = 'block';
        }
      } else {
        document.getElementById('productImagePreview').style.display = 'none';
      }
      
      document.getElementById('productModal').style.display = 'flex';
    })
    .catch(function(err) {
      console.error('Error loading product:', err);
      if (window.showToast) window.showToast('Error loading product', 'error');
    });
}

function saveProduct() {
  var id = document.getElementById('productId').value;
  var formData = new FormData();
  
  formData.append('name', document.getElementById('productName').value);
  formData.append('description', document.getElementById('productDesc').value);
  formData.append('price', document.getElementById('productPrice').value);
  
  var imageFile = document.getElementById('productImage').files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  var url = id ? API_URL + '/products/' + id : API_URL + '/products';
  var method = id ? 'PUT' : 'POST';
  
  var btn = document.getElementById('saveProductBtn');
  var originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  btn.disabled = true;
  
  fetch(url, {
    method: method,
    headers: {
      'x-admin-key': adminKey
    },
    body: formData
  })
    .then(function(res) {
      if (res.ok) {
        closeModals();
        loadProducts();
        if (window.showToast) window.showToast('Product saved successfully', 'success');
      } else {
        return res.json().then(function(err) {
          if (window.showToast) window.showToast(err.error || 'Failed to save product', 'error');
        });
      }
    })
    .catch(function(err) {
      if (window.showToast) window.showToast('Error saving product', 'error');
    })
    .finally(function() {
      btn.innerHTML = originalText;
      btn.disabled = false;
    });
}

function deleteProduct(id) {
  customConfirm('Are you sure you want to delete this product?', function() {
    fetch(API_URL + '/products/' + id, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey }
    })
      .then(function(res) {
        if (res.ok) {
          loadProducts();
          if (window.showToast) window.showToast('Product deleted successfully', 'success');
        } else {
          if (window.showToast) window.showToast('Failed to delete product', 'error');
        }
      })
      .catch(function(err) {
        if (window.showToast) window.showToast('Error deleting product', 'error');
      });
  });
}

function showAddServiceModal() {
  document.getElementById('serviceModalTitle').textContent = 'Add Service';
  document.getElementById('serviceId').value = '';
  document.getElementById('serviceName').value = '';
  document.getElementById('serviceDesc').value = '';
  document.getElementById('servicePrice').value = '';
  setCategoryTriggerValue('Wig Making');
  document.getElementById('serviceImage').value = '';
  document.getElementById('serviceImagePreview').style.display = 'none';
  document.getElementById('serviceModal').style.display = 'flex';
}

function editService(id) {
  fetch(API_URL + '/services/' + id)
    .then(function(res) { return res.json(); })
    .then(function(service) {
      document.getElementById('serviceModalTitle').textContent = 'Edit Service';
      document.getElementById('serviceId').value = service.id;
      document.getElementById('serviceName').value = service.name;
      document.getElementById('serviceDesc').value = service.description || '';
      document.getElementById('servicePrice').value = service.price;
      setCategoryTriggerValue(service.category || 'Wig Making');
      
      if (service.image_url) {
        var preview = document.getElementById('serviceImagePreviewImg');
        var container = document.getElementById('serviceImagePreview');
        if (preview && container) {
          preview.src = service.image_url;
          container.style.display = 'block';
        }
      } else {
        document.getElementById('serviceImagePreview').style.display = 'none';
      }
      
      document.getElementById('serviceModal').style.display = 'flex';
    })
    .catch(function(err) {
      console.error('Error loading service:', err);
      if (window.showToast) window.showToast('Error loading service', 'error');
    });
}

function saveService() {
  var id = document.getElementById('serviceId').value;
  var formData = new FormData();
  
  formData.append('name', document.getElementById('serviceName').value);
  formData.append('description', document.getElementById('serviceDesc').value);
  formData.append('price', document.getElementById('servicePrice').value);
  formData.append('category', getSelectedCategory());
  
  var imageFile = document.getElementById('serviceImage').files[0];
  if (imageFile) {
    formData.append('image', imageFile);
  }
  
  var url = id ? API_URL + '/services/' + id : API_URL + '/services';
  var method = id ? 'PUT' : 'POST';
  
  var btn = document.getElementById('saveServiceBtn');
  var originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  btn.disabled = true;
  
  fetch(url, {
    method: method,
    headers: {
      'x-admin-key': adminKey
    },
    body: formData
  })
    .then(function(res) {
      if (res.ok) {
        closeModals();
        loadServices();
        if (window.showToast) window.showToast('Service saved successfully', 'success');
      } else {
        return res.json().then(function(err) {
          if (window.showToast) window.showToast(err.error || 'Failed to save service', 'error');
        });
      }
    })
    .catch(function(err) {
      if (window.showToast) window.showToast('Error saving service', 'error');
    })
    .finally(function() {
      btn.innerHTML = originalText;
      btn.disabled = false;
    });
}

function deleteService(id) {
  customConfirm('Are you sure you want to delete this service?', function() {
    fetch(API_URL + '/services/' + id, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey }
    })
      .then(function(res) {
        if (res.ok) {
          loadServices();
          if (window.showToast) window.showToast('Service deleted successfully', 'success');
        } else {
          if (window.showToast) window.showToast('Failed to delete service', 'error');
        }
      })
      .catch(function(err) {
        if (window.showToast) window.showToast('Error deleting service', 'error');
      });
  });
}

function initImageUploads() {
  var productFileInput = document.getElementById('productImage');
  if (productFileInput) {
    productFileInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      
      if (file.size > 5 * 1024 * 1024) {
        if (window.showToast) window.showToast('Image size must be less than 5MB', 'error');
        productFileInput.value = '';
        return;
      }
      
      showCropModal(file, 'product');
    });
  }
  
  var serviceFileInput = document.getElementById('serviceImage');
  if (serviceFileInput) {
    serviceFileInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      
      if (file.size > 5 * 1024 * 1024) {
        if (window.showToast) window.showToast('Image size must be less than 5MB', 'error');
        serviceFileInput.value = '';
        return;
      }
      
      showCropModal(file, 'service');
    });
  }
}

function initCategoryDropdown() {
  var trigger = document.getElementById('modalCategoryTrigger');
  var dropdown = document.getElementById('modalCategoryDropdown');
  var hiddenInput = document.getElementById('serviceCategoryHidden');
  
  if (!trigger || !dropdown) return;
  
  trigger.addEventListener('click', function(e) {
    e.stopPropagation();
    var allDropdowns = document.querySelectorAll('.modal-category-dropdown');
    var allTriggers = document.querySelectorAll('.modal-category-trigger');
    allDropdowns.forEach(function(d) {
      if (d !== dropdown) d.classList.remove('open');
    });
    allTriggers.forEach(function(t) {
      if (t !== trigger) t.classList.remove('open');
    });
    dropdown.classList.toggle('open');
    trigger.classList.toggle('open');
  });
  
  var options = dropdown.querySelectorAll('.modal-category-option');
  options.forEach(function(opt) {
    opt.addEventListener('click', function() {
      var value = this.getAttribute('data-value');
      var text = this.textContent;
      trigger.querySelector('span').textContent = text;
      if (hiddenInput) hiddenInput.value = value;
      dropdown.classList.remove('open');
      trigger.classList.remove('open');
    });
  });
}

function getSelectedCategory() {
  var hidden = document.getElementById('serviceCategoryHidden');
  return hidden ? hidden.value : 'Wig Making';
}

function setCategoryTriggerValue(category) {
  var trigger = document.getElementById('modalCategoryTrigger');
  if (trigger) {
    trigger.querySelector('span').textContent = category;
  }
  var hidden = document.getElementById('serviceCategoryHidden');
  if (hidden) hidden.value = category;
}

function closeModals() {
  document.getElementById('productModal').style.display = 'none';
  document.getElementById('serviceModal').style.display = 'none';
  document.getElementById('cropModal').style.display = 'none';
  if (activeCropper) {
    activeCropper.destroy();
    activeCropper = null;
  }
}

function setupTabs() {
  var btns = document.querySelectorAll('.nav-btn');
  var panels = document.querySelectorAll('.admin-panel');
  var contentTitle = document.getElementById('contentTitle');
  
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', (function(btn) {
      return function() {
        for (var j = 0; j < btns.length; j++) {
          btns[j].classList.remove('active');
        }
        btn.classList.add('active');
        
        for (var k = 0; k < panels.length; k++) {
          panels[k].classList.remove('active');
        }
        
        var tab = btn.getAttribute('data-tab');
        document.getElementById(tab + 'Panel').classList.add('active');
        
        if (tab === 'products') {
          contentTitle.textContent = 'Products Management';
        } else if (tab === 'services') {
          contentTitle.textContent = 'Services Management';
        }
        
        closeMobileMenu();
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

// Variables for image preview
var currentProductImage = null;
var existingProductImage = null;
var currentServiceImage = null;
var existingServiceImage = null;

// Admin Dashboard - Initialize when DOM is ready
if (document.getElementById('productsContainer')) {
  adminKey = localStorage.getItem('adminKey');
  if (!adminKey) {
    window.location.href = '/admin/login';
  } else {
    addMobileMenuButton();
    loadProducts();
    loadServices();
    setupTabs();
    initCategoryDropdown();
    initImageUploads();
    
    document.getElementById('addProductBtn')?.addEventListener('click', showAddProductModal);
    document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);
    document.getElementById('addServiceBtn')?.addEventListener('click', showAddServiceModal);
    document.getElementById('saveServiceBtn')?.addEventListener('click', saveService);
    document.getElementById('logoutBtn')?.addEventListener('click', function() {
      customConfirm('Are you sure you want to logout?', function() {
        localStorage.removeItem('adminKey');
        window.location.href = '/admin/login';
      });
    });
    
    document.querySelectorAll('.close-modal').forEach(function(btn) {
      btn.addEventListener('click', function() {
        closeModals();
      });
    });
    
    document.getElementById('cropCancelBtn')?.addEventListener('click', closeCropModal);
    document.getElementById('cropConfirmBtn')?.addEventListener('click', function() {
      if (activeCropper && currentFileToCrop) {
        var canvas = activeCropper.getCroppedCanvas({
          width: 800,
          height: 800,
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high'
        });
        
        // Convert cropped canvas to file
        canvas.toBlob(function(blob) {
          var croppedFile = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
          var dataTransfer = new DataTransfer();
          dataTransfer.items.add(croppedFile);
          
          if (currentCropType === 'product') {
            var productInput = document.getElementById('productImage');
            productInput.files = dataTransfer.files;
            // Show preview
            var previewImg = document.getElementById('productImagePreviewImg');
            var previewContainer = document.getElementById('productImagePreview');
            previewImg.src = canvas.toDataURL();
            previewContainer.style.display = 'block';
          } else if (currentCropType === 'service') {
            var serviceInput = document.getElementById('serviceImage');
            serviceInput.files = dataTransfer.files;
            // Show preview
            var previewImg = document.getElementById('serviceImagePreviewImg');
            var previewContainer = document.getElementById('serviceImagePreview');
            previewImg.src = canvas.toDataURL();
            previewContainer.style.display = 'block';
          }
          
          closeCropModal();
        }, 'image/jpeg', 0.9);
      }
    });
  }
}

// Expose functions to global scope
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.editService = editService;
window.deleteService = deleteService;