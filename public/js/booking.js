var API_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
  setMinDate();
  
  var submitBtn = document.getElementById('submitBookingBtn');
  if (submitBtn) {
    submitBtn.removeEventListener('click', submitBooking);
    submitBtn.addEventListener('click', submitBooking);
  }
});

function setMinDate() {
  var input = document.getElementById('bookingDate');
  if (input) {
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    input.min = yyyy + '-' + mm + '-' + dd;
  }
}

function submitBooking() {
  var nameInput = document.getElementById('bookingName');
  var phoneInput = document.getElementById('bookingPhone');
  var dateInput = document.getElementById('bookingDate');
  var timeSelect = document.getElementById('bookingTime');
  var serviceSelect = document.getElementById('bookingService');
  var notesTextarea = document.getElementById('bookingNotes');
  
  var data = {
    customer_name: nameInput ? nameInput.value : '',
    customer_phone: phoneInput ? phoneInput.value : '',
    booking_date: dateInput ? dateInput.value : '',
    booking_time: timeSelect ? timeSelect.value : '',
    service_type: serviceSelect ? serviceSelect.value : '',
    notes: notesTextarea ? notesTextarea.value : ''
  };
  
  if (!data.customer_name || !data.customer_name.trim()) {
    showToast('Please enter your name', 'error');
    return;
  }
  
  if (!data.booking_date) {
    showToast('Please select a date', 'error');
    return;
  }
  
  if (!data.booking_time) {
    showToast('Please select a time', 'error');
    return;
  }
  
  var btn = document.getElementById('submitBookingBtn');
  var originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  btn.disabled = true;
  
  fetch(API_URL + '/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function(response) { return response.json(); })
  .then(function() {
    var msg = "BIMPZY HAIR WORLD BOOKING\n\n";
    msg += "Name: " + data.customer_name + "\n";
    msg += "Phone: " + (data.customer_phone || 'Not provided') + "\n";
    msg += "Date: " + data.booking_date + "\n";
    msg += "Time: " + data.booking_time + "\n";
    msg += "Service: " + (data.service_type || 'Not specified') + "\n";
    if (data.notes && data.notes.trim()) msg += "Notes: " + data.notes + "\n";
    msg += "\nPlease confirm this booking.";
    
    var whatsappNumber = getWhatsAppNumber();
    var url = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(msg);
    window.open(url, '_blank');
    
    showToast('Booking submitted! Redirecting to WhatsApp...', 'success');
    
    document.getElementById('bookingName').value = '';
    document.getElementById('bookingPhone').value = '';
    document.getElementById('bookingDate').value = '';
    document.getElementById('bookingTime').value = '';
    document.getElementById('bookingService').value = '';
    document.getElementById('bookingNotes').value = '';
    setMinDate();
  })
  .catch(function(err) {
    console.error('Booking error:', err);
    showToast('Error creating booking. Please try again.', 'error');
  })
  .finally(function() {
    btn.innerHTML = originalText;
    btn.disabled = false;
  });
}

var toastContainer = null;

function showToast(message, type) {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  
  var toast = document.createElement('div');
  toast.className = 'toast-notification ' + type;
  var icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
  toast.innerHTML = '<i class="fas ' + icon + '"></i> <span>' + message + '</span>';
  
  toastContainer.appendChild(toast);
  
  setTimeout(function() {
    toast.classList.add('show');
  }, 10);
  
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() {
      toast.remove();
    }, 300);
  }, 3000);
}