var API_URL = '/api';
var adminKey = null;

function toggleMobileMenu() {
  var sidebar = document.querySelector('.admin-sidebar');
  if (sidebar) sidebar.classList.toggle('open');
}

function addMobileMenuButton() {
  if (document.querySelector('.mobile-admin-menu-btn')) return;
  var btn = document.createElement('button');
  btn.className = 'mobile-admin-menu-btn';
  btn.innerHTML = '<i class="fas fa-bars"></i>';
  btn.onclick = toggleMobileMenu;
  document.body.insertBefore(btn, document.body.firstChild);
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
        alert('Invalid username or password');
      }
    } catch (err) {
      alert('Login failed. Please try again.');
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
  
  var currentImageData = null;
  var existingImageData = null;
  
  loadProducts();
  loadBookings();
  setupTabs();
  
  document.getElementById('addProductBtn')?.addEventListener('click', showAddModal);
  document.getElementById('saveProductBtn')?.addEventListener('click', saveProduct);
  document.getElementById('logoutBtn')?.addEventListener('click', function() {
    localStorage.removeItem('adminKey');
    window.location.href = '/admin/login';
  });
  
  document.querySelectorAll('.close-modal').forEach(function(btn) {
    btn.addEventListener('click', closeModal);
  });
  
  var imageInput = document.getElementById('productImage');
  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert('Image size must be less than 2MB');
          imageInput.value = '';
          return;
        }
        var reader = new FileReader();
        reader.onload = function(event) {
          currentImageData = event.target.result;
          var preview = document.getElementById('imagePreview');
          var container = document.getElementById('currentImagePreview');
          if (preview && container) {
            preview.src = currentImageData;
            container.style.display = 'block';
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }
}

async function loadProducts() {
  var res = await fetch(API_URL + '/products');
  var products = await res.json();
  var container = document.getElementById('productsContainer');
  var html = '';
  
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var imageUrl = p.image_data || 'https://placehold.co/400x400/1a1a1a/666?text=No+Image';
    
    html += '<div class="product-admin-card">' +
      '<img src="' + imageUrl + '" class="product-admin-image" alt="' + escapeHtml(p.name) + '">' +
      '<div class="product-admin-info">' +
      '<div class="product-admin-name">' + escapeHtml(p.name) + ' <small>(ID: ' + p.id + ')</small></div>' +
      '<div class="product-admin-price">₦' + parseFloat(p.price).toFixed(2) + '</div>' +
      '<div class="product-admin-category">' + escapeHtml(p.category || 'General') + '</div>' +
      '<div class="product-admin-actions">' +
      '<button class="edit-product-btn" onclick="editProduct(' + p.id + ')"><i class="fas fa-edit"></i> Edit</button>' +
      '<button class="delete-product-btn" onclick="deleteProduct(' + p.id + ')"><i class="fas fa-trash"></i> Delete</button>' +
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

async function loadBookings() {
  var res = await fetch(API_URL + '/bookings', {
    headers: { 'x-admin-key': adminKey }
  });
  var bookings = await res.json();
  var tbody = document.getElementById('bookingsTableBody');
  var html = '';
  
  for (var i = 0; i < bookings.length; i++) {
    var b = bookings[i];
    html += '<tr>' +
      '<td>' + b.id + '</td>' +
      '<td><strong>' + escapeHtml(b.customer_name) + '</strong><br><small>' + escapeHtml(b.customer_phone || 'No phone') + '</small></td>' +
      '<td>' + b.booking_date + '</td>' +
      '<td>' + b.booking_time + '</td>' +
      '<td>' + escapeHtml(b.service_type || '-') + '</td>' +
      '<td><span class="status-badge status-' + b.status + '">' + b.status + '</span></td>' +
      '<td>' +
      (b.status === 'pending' ? 
        '<button class="approve-btn" onclick="updateBookingStatus(' + b.id + ', \'confirmed\')"><i class="fas fa-check"></i></button>' +
        '<button class="cancel-btn" onclick="updateBookingStatus(' + b.id + ', \'cancelled\')"><i class="fas fa-times"></i></button>' : 
        (b.status === 'confirmed' ? 
          '<button class="cancel-btn" onclick="updateBookingStatus(' + b.id + ', \'cancelled\')"><i class="fas fa-times"></i></button>' : 
          '-')) +
      '</td>' +
      '</tr>';
  }
  tbody.innerHTML = html;
}

async function updateBookingStatus(id, status) {
  if (!confirm('Are you sure you want to ' + status + ' this booking?')) return;
  
  try {
    var res = await fetch(API_URL + '/bookings/' + id + '/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey
      },
      body: JSON.stringify({ status: status })
    });
    
    if (res.ok) {
      alert('Booking ' + status + ' successfully!');
      loadBookings();
    } else {
      alert('Failed to update booking status');
    }
  } catch (err) {
    alert('Error updating booking');
  }
}

function showAddModal() {
  document.getElementById('modalTitle').textContent = 'Add Product';
  document.getElementById('productId').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('productDesc').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productCategory').value = 'wigs';
  document.getElementById('productImage').value = '';
  document.getElementById('currentImagePreview').style.display = 'none';
  currentImageData = null;
  existingImageData = null;
  document.getElementById('productModal').style.display = 'flex';
}

async function editProduct(id) {
  var res = await fetch(API_URL + '/products/' + id);
  var product = await res.json();
  
  document.getElementById('modalTitle').textContent = 'Edit Product';
  document.getElementById('productId').value = product.id;
  document.getElementById('productName').value = product.name;
  document.getElementById('productDesc').value = product.description || '';
  document.getElementById('productPrice').value = product.price;
  document.getElementById('productCategory').value = product.category || 'wigs';
  existingImageData = product.image_data;
  
  if (existingImageData) {
    var preview = document.getElementById('imagePreview');
    var container = document.getElementById('currentImagePreview');
    if (preview && container) {
      preview.src = existingImageData;
      container.style.display = 'block';
    }
  } else {
    document.getElementById('currentImagePreview').style.display = 'none';
  }
  
  currentImageData = null;
  document.getElementById('productModal').style.display = 'flex';
}

async function saveProduct() {
  var id = document.getElementById('productId').value;
  var imageData = existingImageData;
  
  if (currentImageData) {
    imageData = currentImageData;
  }
  
  var product = {
    name: document.getElementById('productName').value,
    description: document.getElementById('productDesc').value,
    price: parseFloat(document.getElementById('productPrice').value),
    category: document.getElementById('productCategory').value,
    image_data: imageData
  };
  
  if (!product.name || !product.price) {
    alert('Name and price are required');
    return;
  }
  
  if (!product.image_data && !id) {
    alert('Product image is required');
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
      closeModal();
      loadProducts();
      alert('Product saved successfully!');
    } else {
      var err = await res.json();
      alert(err.error || 'Failed to save product');
    }
  } catch (err) {
    alert('Error saving product');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    var res = await fetch(API_URL + '/products/' + id, {
      method: 'DELETE',
      headers: { 'x-admin-key': adminKey }
    });
    
    if (res.ok) {
      loadProducts();
      alert('Product deleted successfully');
    } else {
      alert('Failed to delete product');
    }
  } catch (err) {
    alert('Error deleting product');
  }
}

function closeModal() {
  document.getElementById('productModal').style.display = 'none';
  currentImageData = null;
  existingImageData = null;
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
        } else {
          contentTitle.textContent = 'Bookings Management';
        }
        
        var sidebar = document.querySelector('.admin-sidebar');
        if (sidebar && window.innerWidth <= 768) {
          sidebar.classList.remove('open');
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

window.updateBookingStatus = updateBookingStatus;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;