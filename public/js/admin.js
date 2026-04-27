var API_URL = '/api';
var adminKey = null;

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

// Toast system
var toastQueue = [];
var isProcessingToast = false;

function showToast(message, type) {
  toastQueue.push({ message: message, type: type });
  processToastQueue();
}

function processToastQueue() {
  if (isProcessingToast || toastQueue.length === 0) return;
  isProcessingToast = true;
  var toastData = toastQueue.shift();
  createToast(toastData.message, toastData.type);
}

function createToast(message, type) {
  var container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  var toast = document.createElement('div');
  toast.className = 'toast-notification ' + type;
  var icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
  toast.innerHTML = '<i class="fas ' + icon + '"></i> <span>' + message + '</span>';
  
  container.appendChild(toast);
  
  setTimeout(function() {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(function() {
    toast.classList.remove('show');
    toast.classList.add('fade-out');
    setTimeout(function() {
      toast.remove();
      isProcessingToast = false;
      processToastQueue();
    }, 300);
  }, 2000);
}

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
        showToast('Invalid username or password', 'error');
      }
    } catch (err) {
      showToast('Login failed. Please try again.', 'error');
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}

// Admin Dashboard
if (document.getElementById('productsContainer')) {
  adminKey = localStorage.getItem('adminKey');
  if (!adminKey) {
    window.location.href = '/admin/login';
  }
  
  addMobileMenuButton();
  
  var currentProductImage = null;
  var existingProductImage = null;
  var currentServiceImage = null;
  var existingServiceImage = null;
  
  loadProducts();
  loadServices();
  loadBookings();
  setupTabs();
  initCategoryDropdown();
  
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
    btn.addEventListener('click', closeModals);
  });
  
  var productImageInput = document.getElementById('productImage');
  if (productImageInput) {
    productImageInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          showToast('Image size must be less than 2MB', 'error');
          productImageInput.value = '';
          return;
        }
        var reader = new FileReader();
        reader.onload = function(event) {
          currentProductImage = event.target.result;
          var preview = document.getElementById('productImagePreviewImg');
          var container = document.getElementById('productImagePreview');
          if (preview && container) {
            preview.src = currentProductImage;
            container.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  var serviceImageInput = document.getElementById('serviceImage');
  if (serviceImageInput) {
    serviceImageInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          showToast('Image size must be less than 2MB', 'error');
          serviceImageInput.value = '';
          return;
        }
        var reader = new FileReader();
        reader.onload = function(event) {
          currentServiceImage = event.target.result;
          var preview = document.getElementById('serviceImagePreviewImg');
          var container = document.getElementById('serviceImagePreview');
          if (preview && container) {
            preview.src = currentServiceImage;
            container.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
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

document.addEventListener('click', function() {
  var allTriggers = document.querySelectorAll('.modal-category-trigger');
  var allDropdowns = document.querySelectorAll('.modal-category-dropdown');
  allDropdowns.forEach(function(d) { d.classList.remove('open'); });
  allTriggers.forEach(function(t) { t.classList.remove('open'); });
});

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
  currentProductImage = null;
  existingProductImage = null;
  currentServiceImage = null;
  existingServiceImage = null;
}

// Products CRUD
async function loadProducts() {
  var res = await fetch(API_URL + '/products');
  var products = await res.json();
  var container = document.getElementById('productsContainer');
  var html = '';
  
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var imageUrl = p.image_data || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
    
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
      '<div class="product-admin-actions">' +
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
}

function showAddProductModal() {
  document.getElementById('productModalTitle').textContent = 'Add Product';
  document.getElementById('productId').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('productDesc').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productImage').value = '';
  document.getElementById('productImagePreview').style.display = 'none';
  currentProductImage = null;
  existingProductImage = null;
  document.getElementById('productModal').style.display = 'flex';
}

async function editProduct(id) {
  var res = await fetch(API_URL + '/products/' + id);
  var product = await res.json();
  
  document.getElementById('productModalTitle').textContent = 'Edit Product';
  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productDesc').value = product.description || '';
  document.getElementById('productPrice').value = product.price;
  existingProductImage = product.image_data;
  
  if (existingProductImage) {
    var preview = document.getElementById('productImagePreviewImg');
    var container = document.getElementById('productImagePreview');
    if (preview && container) {
      preview.src = existingProductImage;
      container.style.display = 'block';
    }
  } else {
    document.getElementById('productImagePreview').style.display = 'none';
  }
  
  currentProductImage = null;
  document.getElementById('productModal').style.display = 'flex';
}

async function saveProduct() {
  var id = document.getElementById('productId').value;
  var imageData = existingProductImage;
  
  if (currentProductImage) {
    imageData = currentProductImage;
  }
  
  var product = {
    name: document.getElementById('productName').value,
    description: document.getElementById('productDesc').value,
    price: parseFloat(document.getElementById('productPrice').value),
    image_data: imageData
  };
  
  if (!product.name || !product.price) {
    showToast('Name and price are required', 'error');
    return;
  }
  
  if (!product.image_data && !id) {
    showToast('Product image is required', 'error');
    return;
  }
  
  var url = id ? API_URL + '/products/' + id : API_URL + '/products';
  var method = id ? 'PUT' : 'POST';
  
  var btn = document.getElementById('saveProductBtn');
  var originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  btn.disabled = true;
  
  try {
    var res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify(product)
    });
    
    if (res.ok) {
      closeModals();
      loadProducts();
      showToast('Product saved successfully', 'success');
    } else {
      var err = await res.json();
      showToast(err.error || 'Failed to save product', 'error');
    }
  } catch (err) {
    showToast('Error saving product', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function deleteProduct(id) {
  customConfirm('Are you sure you want to delete this product?', async function() {
    try {
      var res = await fetch(API_URL + '/products/' + id, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      
      if (res.ok) {
        loadProducts();
        showToast('Product deleted successfully', 'success');
      } else {
        showToast('Failed to delete product', 'error');
      }
    } catch (err) {
      showToast('Error deleting product', 'error');
    }
  });
}

// Services CRUD
async function loadServices() {
  var res = await fetch(API_URL + '/services');
  var services = await res.json();
  var container = document.getElementById('servicesContainer');
  var html = '';
  
  for (var i = 0; i < services.length; i++) {
    var s = services[i];
    var imageUrl = s.image_data || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
    
    html += '<div class="product-admin-card">' +
      '<div class="product-admin-top">' +
      '<img src="' + imageUrl + '" class="product-admin-image" alt="' + escapeHtml(s.name) + '">' +
      '<div class="product-admin-info">' +
      '<div class="product-admin-name">' + escapeHtml(s.name) + '</div>' +
      '<div class="product-admin-price">₦' + parseFloat(s.price).toFixed(2) + '</div>' +
      '</div>' +
      '</div>' +
      '<div class="product-admin-bottom">' +
      '<span class="product-admin-category">' + escapeHtml(s.category || 'General') + '</span>' +
      '<div class="product-admin-actions">' +
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
  currentServiceImage = null;
  existingServiceImage = null;
  document.getElementById('serviceModal').style.display = 'flex';
}

async function editService(id) {
  var res = await fetch(API_URL + '/services/' + id);
  var service = await res.json();
  
  document.getElementById('serviceModalTitle').textContent = 'Edit Service';
  document.getElementById('serviceId').value = service.id;
  document.getElementById('serviceName').value = service.name;
  document.getElementById('serviceDesc').value = service.description || '';
  document.getElementById('servicePrice').value = service.price;
  setCategoryTriggerValue(service.category || 'Wig Making');
  existingServiceImage = service.image_data;
  
  if (existingServiceImage) {
    var preview = document.getElementById('serviceImagePreviewImg');
    var container = document.getElementById('serviceImagePreview');
    if (preview && container) {
      preview.src = existingServiceImage;
      container.style.display = 'block';
    }
  } else {
    document.getElementById('serviceImagePreview').style.display = 'none';
  }
  
  currentServiceImage = null;
  document.getElementById('serviceModal').style.display = 'flex';
}

async function saveService() {
  var id = document.getElementById('serviceId').value;
  var imageData = existingServiceImage;
  
  if (currentServiceImage) {
    imageData = currentServiceImage;
  }
  
  var service = {
    name: document.getElementById('serviceName').value,
    description: document.getElementById('serviceDesc').value,
    price: parseFloat(document.getElementById('servicePrice').value),
    category: getSelectedCategory(),
    image_data: imageData
  };
  
  if (!service.name || !service.price) {
    showToast('Name and price are required', 'error');
    return;
  }
  
  if (!service.image_data && !id) {
    showToast('Service image is required', 'error');
    return;
  }
  
  var url = id ? API_URL + '/services/' + id : API_URL + '/services';
  var method = id ? 'PUT' : 'POST';
  
  var btn = document.getElementById('saveServiceBtn');
  var originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  btn.disabled = true;
  
  try {
    var res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify(service)
    });
    
    if (res.ok) {
      closeModals();
      loadServices();
      showToast('Service saved successfully', 'success');
    } else {
      var err = await res.json();
      showToast(err.error || 'Failed to save service', 'error');
    }
  } catch (err) {
    showToast('Error saving service', 'error');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function deleteService(id) {
  customConfirm('Are you sure you want to delete this service?', async function() {
    try {
      var res = await fetch(API_URL + '/services/' + id, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      
      if (res.ok) {
        loadServices();
        showToast('Service deleted successfully', 'success');
      } else {
        showToast('Failed to delete service', 'error');
      }
    } catch (err) {
      showToast('Error deleting service', 'error');
    }
  });
}

// Bookings CRUD
async function loadBookings() {
  var res = await fetch(API_URL + '/bookings', {
    headers: { 'x-admin-key': adminKey }
  });
  var bookings = await res.json();
  var tbody = document.getElementById('bookingsTableBody');
  var html = '';
  
  for (var i = 0; i < bookings.length; i++) {
    var b = bookings[i];
    var timeOnly = b.booking_time.split(' - ')[0];
    var dateTime = b.booking_date + ' ' + timeOnly;
    html += '<tr>' +
      '<td data-label="Customer"><strong>' + escapeHtml(b.customer_name) + '</strong><br><small>' + escapeHtml(b.customer_phone || 'No phone') + '</small></td>' +
      '<td data-label="Date & Time">' + escapeHtml(dateTime) + '</td>' +
      '<td data-label="Service">' + escapeHtml(b.service_type || '-') + '</td>' +
      '<td data-label="Actions"><button class="delete-booking-btn" onclick="deleteBooking(' + b.id + ')"><i class="fas fa-trash"></i></button></td>' +
      '</tr>';
  }
  
  if (bookings.length === 0) {
    html = '<tr><td colspan="4" style="text-align:center;">No bookings found</td></tr>';
  }
  
  tbody.innerHTML = html;
}

function deleteBooking(id) {
  customConfirm('Are you sure you want to delete this booking?', async function() {
    try {
      var res = await fetch(API_URL + '/bookings/' + id, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      
      if (res.ok) {
        showToast('Booking deleted successfully', 'success');
        loadBookings();
      } else {
        showToast('Failed to delete booking', 'error');
      }
    } catch (err) {
      showToast('Error deleting booking', 'error');
    }
  });
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
        } else {
          contentTitle.textContent = 'Bookings Management';
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

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.editService = editService;
window.deleteService = deleteService;
window.deleteBooking = deleteBooking;