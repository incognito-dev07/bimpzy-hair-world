let WHATSAPP_NUMBER;

async function loadConfig() {
  try {
    const response = await fetch('/api/config');
    const config = await response.json();
    WHATSAPP_NUMBER = config.whatsappNumber;
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

function getWhatsAppNumber() {
  return WHATSAPP_NUMBER;
}

loadConfig();

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }
});