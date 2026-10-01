/**
 * Stackly Recruitment Agency - Interactive Dashboard Script
 * Handles Canvas Charts, Sidebar Toggles, Table Search/Filters, and Quick Actions
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebarToggle();
  initDashboardCharts();
  initTableSearch();
  initQuickActions();
  initUserEmailDisplay();
  initSidebarTabNavigation();
});

function formatNameFromEmail(email) {
  if (!email || !email.includes('@')) return null;
  const usernamePart = email.split('@')[0];
  const parts = usernamePart.split(/[\._\-]+/);
  const formattedName = parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ');
  return formattedName || null;
}

function initUserEmailDisplay() {
  const emailDisplays = document.querySelectorAll('.user-email-display');
  const userNames = document.querySelectorAll('.user-name, .user-greeting-name');
  const savedEmail = localStorage.getItem('userEmail');

  if (savedEmail) {
    emailDisplays.forEach(el => {
      el.textContent = savedEmail;
    });

    const derivedName = formatNameFromEmail(savedEmail);
    if (derivedName) {
      userNames.forEach(el => {
        el.textContent = derivedName;
      });
    }
  }
}

function initSidebarTabNavigation() {
  const sidebarItems = document.querySelectorAll('.sidebar-menu .sidebar-item');
  if (!sidebarItems.length) return;

  sidebarItems.forEach(item => {
    const href = item.getAttribute('href');
    if (!href || !href.startsWith('#')) return;

    item.addEventListener('click', (e) => {
      e.preventDefault();

      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const targetId = href.substring(1);
      switchDashboardContent(targetId);

      if (window.innerWidth <= 992 && typeof window.closeSidebar === 'function') {
        window.closeSidebar();
      }
    });
  });

  // Initial tab render based on default active item
  const activeItem = document.querySelector('.sidebar-menu .sidebar-item.active');
  if (activeItem) {
    const activeHref = activeItem.getAttribute('href');
    if (activeHref && activeHref.startsWith('#')) {
      switchDashboardContent(activeHref.substring(1));
    }
  }
}

function switchDashboardContent(targetId) {
  const body = document.querySelector('.dashboard-body');
  if (!body) return;

  const children = Array.from(body.children);

  if (targetId === 'overview') {
    children.forEach(child => {
      if (child.id === 'overview-wrapper' || child.id === 'overview' || child.id === 'kpis' || child.classList.contains('grid-2')) {
        child.style.display = '';
      } else {
        child.style.display = 'none';
      }
    });
  } else if (targetId === 'welcome') {
    children.forEach(child => {
      if (child.id === 'welcome-wrapper' || child.id === 'welcome' || child.id === 'personal-kpis') {
        child.style.display = '';
      } else {
        child.style.display = 'none';
      }
    });
  } else {
    children.forEach(child => {
      if (child.id === targetId || child.querySelector('#' + targetId)) {
        child.style.display = '';
      } else {
        child.style.display = 'none';
      }
    });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --------------------------------------------------------------------------
   1. Responsive Sidebar Collapse/Expand Toggle
   -------------------------------------------------------------------------- */
function initSidebarToggle() {
  const sidebar = document.querySelector('.dashboard-sidebar');
  if (!sidebar) return;

  let overlay = document.querySelector('.dashboard-sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'dashboard-sidebar-overlay';
    document.body.appendChild(overlay);
  }

  let toggleBtn = document.querySelector('.sidebar-toggle-btn');
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle Dashboard Sidebar');
    toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.appendChild(toggleBtn);
  }

  function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    toggleBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  window.closeSidebar = function() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.touchAction = '';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sidebar.classList.contains('active')) {
      window.closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener('click', () => {
    window.closeSidebar();
  });

  const sidebarClickables = sidebar.querySelectorAll('a, button, .sidebar-item');
  sidebarClickables.forEach(el => {
    el.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        window.closeSidebar();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Dynamic HTML5 Canvas Chart Renderers (No Heavy Dependencies)
   -------------------------------------------------------------------------- */
function initDashboardCharts() {
  renderHiringFunnelChart();
  renderPlacementTrendChart();

  window.removeEventListener('resize', initDashboardCharts);
  window.addEventListener('resize', initDashboardCharts);
}

function renderHiringFunnelChart() {
  const canvas = document.getElementById('funnelChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const data = [
    { label: 'Sourced', value: 1240, color: '#2563EB' },
    { label: 'Screened', value: 850, color: '#0284C7' },
    { label: 'Submitted', value: 420, color: '#0D9488' },
    { label: 'Interviewed', value: 210, color: '#D97706' },
    { label: 'Offered', value: 95, color: '#9333EA' },
    { label: 'Placed', value: 78, color: '#10B981' }
  ];

  const parentWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 300;
  const width = canvas.width = Math.max(parentWidth, 240);
  const height = canvas.height = 260;

  const maxVal = 1240;
  const barHeight = 26;
  const gap = 12;

  ctx.clearRect(0, 0, width, height);

  const labelColWidth = width < 340 ? 75 : 105;
  const availableWidth = Math.max(width - labelColWidth - 55, 60);

  data.forEach((item, index) => {
    const y = index * (barHeight + gap) + 15;
    const barWidth = (item.value / maxVal) * availableWidth;

    // Label
    ctx.fillStyle = '#475569';
    ctx.font = '600 12px Segoe UI';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, 4, y + 17);

    // Bar background
    ctx.fillStyle = '#F1F5F9';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(labelColWidth, y, availableWidth, barHeight, 6);
    else ctx.rect(labelColWidth, y, availableWidth, barHeight);
    ctx.fill();

    // Bar fill
    ctx.fillStyle = item.color;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(labelColWidth, y, Math.max(barWidth, 6), barHeight, 6);
    else ctx.rect(labelColWidth, y, Math.max(barWidth, 6), barHeight);
    ctx.fill();

    // Value text
    ctx.fillStyle = '#0F172A';
    ctx.font = '700 11px Segoe UI';
    ctx.fillText(item.value.toString(), labelColWidth + barWidth + 6, y + 17);
  });
}

function renderPlacementTrendChart() {
  const canvas = document.getElementById('placementTrendChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const placements = [24, 31, 28, 42, 38, 55, 62, 58, 74];

  const parentWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 300;
  const width = canvas.width = Math.max(parentWidth, 240);
  const height = canvas.height = 260;

  ctx.clearRect(0, 0, width, height);

  const paddingLeft = 32;
  const paddingBottom = 35;
  const chartWidth = width - paddingLeft - 15;
  const chartHeight = height - paddingBottom - 15;
  const maxVal = 80;

  // Draw grid lines
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = 15 + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - 15, y);
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '10px Segoe UI';
    ctx.textAlign = 'right';
    ctx.fillText((maxVal - (maxVal / 4) * i).toString(), paddingLeft - 6, y + 4);
  }

  // Draw line graph
  const points = [];
  const stepX = chartWidth / (months.length - 1);

  placements.forEach((val, i) => {
    const x = paddingLeft + i * stepX;
    const y = 20 + chartHeight - (val / maxVal) * chartHeight;
    points.push({ x, y });

    // Month labels
    ctx.fillStyle = '#64748B';
    ctx.font = '600 12px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(months[i], x, height - 12);
  });

  // Gradient fill area
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, 'rgba(37, 99, 235, 0.35)');
  gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(points[0].x, height - paddingBottom);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, height - paddingBottom);
  ctx.closePath();
  ctx.fill();

  // Draw stroke line
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((p, i) => {
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  });
  ctx.stroke();

  // Draw dots
  points.forEach(p => {
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
}

/* --------------------------------------------------------------------------
   3. Table Live Filter & Search
   -------------------------------------------------------------------------- */
function initTableSearch() {
  const searchInput = document.getElementById('dash-table-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('.dash-table tbody tr');

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      if (text.includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. Quick Action Button Handlers
   -------------------------------------------------------------------------- */
function initQuickActions() {
  const actionBtns = document.querySelectorAll('[data-quick-action]');

  actionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      const onclickAttr = btn.getAttribute('onclick');
      if (href === '404.html' || (href === '#' && !onclickAttr)) {
        e.preventDefault();
        window.location.href = '404.html';
      }
    });
  });
}
