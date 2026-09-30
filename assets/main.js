/**
 * Stackly Recruitment Agency - Main Global JavaScript
 * Handles Header Sticky, Mobile Drawer, Accordions, Toasts, and Global Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  initAccordions();
  initStatsCounter();
  initActiveNavLink();
  initFormAndCtaRedirects();
});

function initFormAndCtaRedirects() {
  const forms = document.querySelectorAll('form:not(#login-form):not(#signup-form)');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  });

  const buttons = document.querySelectorAll('.newsletter-form button');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href === '#' || href === '404.html') {
        e.preventDefault();
        window.location.href = '404.html';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   1. Header Sticky & Scroll Detection
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');

  if (!mobileToggle || !drawerOverlay) return;

  function openDrawer() {
    drawerOverlay.classList.add('active');
    const drawer = drawerOverlay.querySelector('.mobile-drawer');
    if (drawer) drawer.classList.add('active');
    mobileToggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  function closeDrawer() {
    drawerOverlay.classList.remove('active');
    const drawer = drawerOverlay.querySelector('.mobile-drawer');
    if (drawer) drawer.classList.remove('active');
    mobileToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.touchAction = '';
  }

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (drawerOverlay.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  drawerOverlay.addEventListener('click', (e) => {
    if (e.target === drawerOverlay || e.target.classList.contains('mobile-drawer-overlay')) {
      closeDrawer();
    }
  });

  const drawerClickables = drawerOverlay.querySelectorAll('a, button:not(.drawer-close)');
  drawerClickables.forEach(el => {
    el.addEventListener('click', closeDrawer);
  });
}

/* --------------------------------------------------------------------------
   3. Accordion FAQ Component
   -------------------------------------------------------------------------- */
function initAccordions() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('active');

      // Close all accordions in same group if needed
      const siblingItems = item.parentElement.querySelectorAll('.accordion-item');
      siblingItems.forEach(sibling => sibling.classList.remove('active'));

      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Stats Counter Animation
   -------------------------------------------------------------------------- */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        let count = 0;
        const duration = 2000;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          count += increment;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          el.textContent = `${prefix}${Math.floor(count).toLocaleString()}${suffix}`;
        }, stepTime);

        obs.unobserve(el);
      }
    });
  }, observerOptions);

  statNumbers.forEach(stat => observer.observe(stat));
}

/* --------------------------------------------------------------------------
   5. Active Nav Link Highlight
   -------------------------------------------------------------------------- */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .drawer-link, .footer-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });
}

/* --------------------------------------------------------------------------
   6. Global Toast System (Replaces Browser alert())
   -------------------------------------------------------------------------- */
window.showToast = function(title, message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'fa-info-circle';
  if (type === 'success') iconClass = 'fa-check-circle';
  if (type === 'error') iconClass = 'fa-exclamation-triangle';

  toast.innerHTML = `
    <i class="fa-solid ${iconClass} toast-icon"></i>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close Toast"><i class="fa-solid fa-xmark"></i></button>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove
  const autoRemove = setTimeout(() => {
    removeToast(toast);
  }, 4500);

  toast.querySelector('.toast-close').addEventListener('click', () => {
    clearTimeout(autoRemove);
    removeToast(toast);
  });
};

function removeToast(toast) {
  toast.classList.remove('show');
  setTimeout(() => {
    if (toast.parentElement) toast.parentElement.removeChild(toast);
  }, 300);
}
