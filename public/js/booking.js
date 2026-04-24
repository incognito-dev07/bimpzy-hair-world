var API_URL = '/api';

document.addEventListener('DOMContentLoaded', function() {
  setMinDate();
  
  var form = document.getElementById('bookingForm');
  if (form) {
    form.removeEventListener('submit', submitBooking);
    form.addEventListener('submit', submitBooking);
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

function submitBooking(event) {
  event.preventDefault();
  event.stopPropagation();
  
  var form = event.target;
  var nameInput = form.querySelector('input[name="name"]');
  var phoneInput = form.querySelector('input[name="phone"]');
  var dateInput = form.querySelector('input[name="date"]');
  var timeSelect = form.querySelector('select[name="time"]');
  var serviceSelect = form.querySelector('select[name="service"]');
  var notesTextarea = form.querySelector('textarea[name="notes"]');
  
  var data = {
    customer_name: nameInput ? nameInput.value : '',
    customer_phone: phoneInput ? phoneInput.value : '',
    booking_date: dateInput ? dateInput.value : '',
    booking_time: timeSelect ? timeSelect.value : '',
    service_type: serviceSelect ? serviceSelect.value : '',
    notes: notesTextarea ? notesTextarea.value : ''
  };
  
  if (!data.customer_name || !data.booking_date || !data.booking_time) {
    alert('Please fill all required fields');
    return false;
  }
  
  var btn = form.querySelector('.submit-btn');
  var originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  btn.disabled = true;
  
  fetch(API_URL + '/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function(response) { return response.json(); })
  .then(function(result) {
    var msg = "*📅 BIM

PZY HAIR WORLD BOOKING* 📅\n\n";
    msg += "*Name:* " + data.customer_name + "\n";
    msg += "*Phone:* " + (data.customer_phone || 'Not provided') + "\n";
    msg += "*Date:* " + data.booking_date + "\n";
    msg += "*Time:* " + data.booking_time + "\n";
    msg += "*Service:* " + (data.service_type || 'Not specified') + "\n";
    if (data.notes) msg += "*Notes:* " + data.notes + "\n";
    msg += "\nPlease confirm this booking.";
    
    var whatsappNumber = getWhatsAppNumber();
    var url = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(msg);
    window.open(url, '_blank');
    
    alert('Booking submitted! Redirecting to WhatsApp...');
    form.reset();
    setMinDate();
  })
  .catch(function(err) {
    console.error('Booking error:', err);
    alert('Error creating booking. Please try again.');
  })
  .finally(function() {
    btn.innerHTML = originalText;
    btn.disabled = false;
  });
  
  return false;
}