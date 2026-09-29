/**
 * Apex Talent Partners - Auth Handler & Role Selection UI Controls
 * Password toggles, role card pickers, demo credential autofills, logout handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initRoleCardSelection();
  initPasswordToggles();
  initDemoCredentials();
  initLogoutHandler();
});

/* --------------------------------------------------------------------------
   1. Role Selector Card Click Interaction
   -------------------------------------------------------------------------- */
function initRoleCardSelection() {
  const roleCards = document.querySelectorAll('.role-card');

  roleCards.forEach(card => {
    card.addEventListener('click', () => {
      const parentContainer = card.closest('.role-selector');
      if (parentContainer) {
        parentContainer.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
      }
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
}

/* --------------------------------------------------------------------------
   2. Password Show/Hide Toggle Button
   -------------------------------------------------------------------------- */
function initPasswordToggles() {
  const toggleBtns = document.querySelectorAll('.password-toggle-btn');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling || btn.parentElement.querySelector('input');
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
      } else {
        input.type = 'password';
        btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Demo Credential Quick Autofill Buttons for Testing
   -------------------------------------------------------------------------- */
function initDemoCredentials() {
  const demoAdminBtn = document.getElementById('demo-admin-fill');
  const demoRecruiterBtn = document.getElementById('demo-recruiter-fill');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  if (demoAdminBtn && emailInput && passwordInput) {
    demoAdminBtn.addEventListener('click', () => {
      emailInput.value = 'admin@apextalent.com';
      passwordInput.value = 'AdminPass2026!';
      
      const adminRadio = document.querySelector('input[name="login-role"][value="Admin"]');
      if (adminRadio) {
        adminRadio.checked = true;
        adminRadio.closest('.role-card')?.click();
      }
      window.showToast('Demo Credentials Loaded', 'Filled Admin credentials (admin@apextalent.com). Click "Sign In to Dashboard".', 'info');
    });
  }

  if (demoRecruiterBtn && emailInput && passwordInput) {
    demoRecruiterBtn.addEventListener('click', () => {
      emailInput.value = 'recruiter@apextalent.com';
      passwordInput.value = 'RecruiterPass2026!';
      
      const recruiterRadio = document.querySelector('input[name="login-role"][value="Recruiter"]');
      if (recruiterRadio) {
        recruiterRadio.checked = true;
        recruiterRadio.closest('.role-card')?.click();
      }
      window.showToast('Demo Credentials Loaded', 'Filled Recruiter credentials (recruiter@apextalent.com). Click "Sign In to Workspace".', 'info');
    });
  }
}

/* --------------------------------------------------------------------------
   4. Dashboard Logout Flow -> index.html
   -------------------------------------------------------------------------- */
function initLogoutHandler() {
  const logoutLinks = document.querySelectorAll('.logout-btn');

  logoutLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.showToast('Signing Out', 'Logging out of Apex Talent Partners portal...', 'info');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  });
}
