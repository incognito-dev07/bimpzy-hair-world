// Shared Toast System
var toastQueue = [];
var isProcessingToast = false;

window.showToast = function(message, type) {
  toastQueue.push({ message: message, type: type });
  processToastQueue();
};

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