function initCustomDropdowns() {
  var timeTrigger = document.getElementById('timeSelectTrigger');
  var timeDropdown = document.getElementById('timeSelectDropdown');
  var timeInput = document.getElementById('bookingTime');
  
  if (timeTrigger && timeDropdown) {
    var newTimeTrigger = timeTrigger.cloneNode(true);
    timeTrigger.parentNode.replaceChild(newTimeTrigger, timeTrigger);
    timeTrigger = newTimeTrigger;
    
    var timeChevron = timeTrigger.querySelector('i');
    
    timeTrigger.addEventListener('click', function(e) {
      e.stopPropagation();
      var allTriggers = document.querySelectorAll('.custom-select-trigger');
      var allDropdowns = document.querySelectorAll('.custom-select-dropdown');
      allTriggers.forEach(function(t) {
        if (t !== timeTrigger) {
          t.classList.remove('open');
          var chev = t.querySelector('i');
          if (chev) chev.className = 'fas fa-chevron-down';
        }
      });
      allDropdowns.forEach(function(d) {
        if (d !== timeDropdown) {
          d.classList.remove('open');
        }
      });
      timeDropdown.classList.toggle('open');
      timeTrigger.classList.toggle('open');
      if (timeChevron) {
        if (timeTrigger.classList.contains('open')) {
          timeChevron.className = 'fas fa-chevron-up';
        } else {
          timeChevron.className = 'fas fa-chevron-down';
        }
      }
    });
    
    var timeOptions = timeDropdown.querySelectorAll('.custom-option');
    timeOptions.forEach(function(opt) {
      var newOpt = opt.cloneNode(true);
      opt.parentNode.replaceChild(newOpt, opt);
      newOpt.addEventListener('click', function() {
        var value = this.getAttribute('data-value');
        var text = this.textContent;
        timeTrigger.querySelector('span').textContent = text;
        timeInput.value = value;
        timeDropdown.classList.remove('open');
        timeTrigger.classList.remove('open');
        if (timeChevron) timeChevron.className = 'fas fa-chevron-down';
      });
    });
  }
  
  var serviceTrigger = document.getElementById('serviceSelectTrigger');
  var serviceDropdown = document.getElementById('serviceSelectDropdown');
  var serviceInput = document.getElementById('bookingService');
  
  if (serviceTrigger && serviceDropdown) {
    var newServiceTrigger = serviceTrigger.cloneNode(true);
    serviceTrigger.parentNode.replaceChild(newServiceTrigger, serviceTrigger);
    serviceTrigger = newServiceTrigger;
    
    var serviceChevron = serviceTrigger.querySelector('i');
    
    serviceTrigger.addEventListener('click', function(e) {
      e.stopPropagation();
      var allTriggers = document.querySelectorAll('.custom-select-trigger');
      var allDropdowns = document.querySelectorAll('.custom-select-dropdown');
      allTriggers.forEach(function(t) {
        if (t !== serviceTrigger) {
          t.classList.remove('open');
          var chev = t.querySelector('i');
          if (chev) chev.className = 'fas fa-chevron-down';
        }
      });
      allDropdowns.forEach(function(d) {
        if (d !== serviceDropdown) {
          d.classList.remove('open');
        }
      });
      serviceDropdown.classList.toggle('open');
      serviceTrigger.classList.toggle('open');
      if (serviceChevron) {
        if (serviceTrigger.classList.contains('open')) {
          serviceChevron.className = 'fas fa-chevron-up';
        } else {
          serviceChevron.className = 'fas fa-chevron-down';
        }
      }
    });
    
    var serviceOptions = serviceDropdown.querySelectorAll('.custom-option');
    serviceOptions.forEach(function(opt) {
      var newOpt = opt.cloneNode(true);
      opt.parentNode.replaceChild(newOpt, opt);
      newOpt.addEventListener('click', function() {
        var value = this.getAttribute('data-value');
        var text = this.textContent;
        serviceTrigger.querySelector('span').textContent = text;
        serviceInput.value = value;
        serviceDropdown.classList.remove('open');
        serviceTrigger.classList.remove('open');
        if (serviceChevron) serviceChevron.className = 'fas fa-chevron-down';
      });
    });
  }
}

document.addEventListener('click', function() {
  var allTriggers = document.querySelectorAll('.custom-select-trigger');
  var allDropdowns = document.querySelectorAll('.custom-select-dropdown');
  allDropdowns.forEach(function(d) { d.classList.remove('open'); });
  allTriggers.forEach(function(t) {
    t.classList.remove('open');
    var chevron = t.querySelector('i');
    if (chevron) chevron.className = 'fas fa-chevron-down';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  setMinDate();
  initCustomDropdowns();
  
  var submitBtn = document.getElementById('submitBookingBtn');
  if (submitBtn) {
    var newSubmitBtn = submitBtn.cloneNode(true);
    submitBtn.parentNode.replaceChild(newSubmitBtn, submitBtn);
    newSubmitBtn.addEventListener('click', submitBooking);
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
  var timeInput = document.getElementById('bookingTime');
  var serviceInput = document.getElementById('bookingService');
  var notesTextarea = document.getElementById('bookingNotes');
  
  var data = {
    customer_name: nameInput ? nameInput.value : '',
    customer_phone: phoneInput ? phoneInput.value : '',
    booking_date: dateInput ? dateInput.value : '',
    booking_time: timeInput ? timeInput.value : '',
    service_type: serviceInput ? serviceInput.value : '',
    notes: notesTextarea ? notesTextarea.value : ''
  };
  
  if (!data.customer_name || !data.customer_name.trim()) {
    if (window.showToast) window.showToast('Please enter your name', 'error');
    return;
  }
  
  if (!data.booking_date) {
    if (window.showToast) window.showToast('Please select a date', 'error');
    return;
  }
  
  if (!data.booking_time) {
    if (window.showToast) window.showToast('Please select a time', 'error');
    return;
  }
  
  var btn = document.getElementById('submitBookingBtn');
  var originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  btn.disabled = true;
  
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
  
  if (window.showToast) window.showToast('Redirecting to WhatsApp...', 'success');
  
  document.getElementById('bookingName').value = '';
  document.getElementById('bookingPhone').value = '';
  document.getElementById('bookingDate').value = '';
  document.getElementById('bookingTime').value = '';
  document.getElementById('bookingService').value = '';
  document.getElementById('bookingNotes').value = '';
  setMinDate();
  
  var timeTrigger = document.getElementById('timeSelectTrigger');
  var serviceTrigger = document.getElementById('serviceSelectTrigger');
  if (timeTrigger) timeTrigger.querySelector('span').textContent = 'Select time';
  if (serviceTrigger) serviceTrigger.querySelector('span').textContent = 'Select a service';
  
  btn.innerHTML = originalText;
  btn.disabled = false;
}