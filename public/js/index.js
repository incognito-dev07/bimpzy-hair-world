var WHATSAPP_NUMBER;

async function loadConfig() {
  try {
    var response = await fetch('/api/config');
    var config = await response.json();
    WHATSAPP_NUMBER = config.whatsappNumber;
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

function getWhatsAppNumber() {
  return WHATSAPP_NUMBER;
}

loadConfig();

// Mobile menu toggle with icon transition
document.addEventListener('DOMContentLoaded', function() {
  var menuBtn = document.getElementById('mobileMenuBtn');
  var navLinks = document.getElementById('navLinks');
  var menuIcon = menuBtn ? menuBtn.querySelector('i') : null;
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('show');
      menuBtn.classList.toggle('active');
      if (menuBtn.classList.contains('active')) {
        menuIcon.className = 'fas fa-times';
      } else {
        menuIcon.className = 'fas fa-bars';
      }
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (navLinks && navLinks.classList.contains('show')) {
      if (!menuBtn.contains(event.target) && !navLinks.contains(event.target)) {
        navLinks.classList.remove('show');
        menuBtn.classList.remove('active');
        if (menuIcon) menuIcon.className = 'fas fa-bars';
      }
    }
  });
});

// Lazy load images using Intersection Observer
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('.product-image').forEach(function(img) {
      imageObserver.observe(img);
    });
  }
}

// Run after content loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
  initLazyLoading();
}