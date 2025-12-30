// ==================== AvalonFlow Core Script ====================
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     AUTHENTICATION (DEMO)
  ============================================================ */

  function login() {
    const idInput = document.getElementById('AvalonFlowID');
    const pwInput = document.getElementById('password');
    const errorBox = document.getElementById('loginError');

    if (!idInput || !pwInput) return;

    const demoID = 'AVF-2739XG-LUX78';
    const demoPW = 'avalon123';

    if (idInput.value === demoID && pwInput.value === demoPW) {
      localStorage.setItem('loggedIn', 'true');
      window.location.href = 'dashboard.html';
    } else if (errorBox) {
      errorBox.textContent =
        'Access details not recognized. Please check and try again.';
    }
  }
  window.login = login;

  function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
  }
  window.logout = logout;

  /* ============================================================
     PAGE ACCESS CONTROL
  ============================================================ */

  if (document.body.dataset.requiresLogin === 'true') {
    if (localStorage.getItem('loggedIn') !== 'true') {
      window.location.replace('index.html');
      return;
    }
  }

  /* ============================================================
     SIDEBAR / OVERLAY
  ============================================================ */

  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');

  function toggleSidebar() {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('active');
  }
  window.toggleSidebar = toggleSidebar;

  /* ============================================================
     PARTICLE BACKGROUND
  ============================================================ */

  const bg = document.getElementById('floating-bg');
  if (bg) {
    const colors = ['#6b2cd8', '#9b59b6', '#8e44ad'];
    const maxParticles = 40;

    function spawnParticle() {
      const p = document.createElement('div');
      p.className = 'particle';

      const size = Math.random() * 15 + 10;
      p.style.width = p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}vw`;
      p.style.background =
        `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;
      p.style.animationDuration = `${Math.random() * 15 + 10}s`;

      bg.appendChild(p);
      setTimeout(() => p.remove(), 25000);
    }

    for (let i = 0; i < maxParticles; i++) {
      setTimeout(spawnParticle, i * 150);
    }
    setInterval(spawnParticle, 1000);
  }

  /* ============================================================
     BRANCH UNLOCKING & PAYMENTS
  ============================================================ */

  const unlockedBranches = {};

  function unlockBranch(branch) {
    const links = {
      care: 'https://app.paymento.io/payment-link/aaf970b845624de0b5eea78726134e79',
      grow: 'https://app.paymento.io/payment-link/829c6748054a418f8226cb20387729f8',
      ease: 'https://app.paymento.io/payment-link/0ddcf9e099234b39ae2acbac693d527f'
    };

    if (links[branch]) {
      window.open(links[branch], '_blank');
      unlockedBranches[branch] = true;
      updateDashboardProgress();
      updateRewardsProgress();
    }
  }
  window.unlockBranch = unlockBranch;

  /* ============================================================
     DASHBOARD PROGRESS (12-HOUR LOGICAL WING)
  ============================================================ */

  const progressFill = document.getElementById('progressFill');
  const progressContainer = document.getElementById('progressContainer');
  const FILL_DURATION = 12 * 60 * 60 * 1000;

  function updateDashboardProgress() {
    if (!progressFill) return;

    let start =
      Number(localStorage.getItem('logicalWingStart')) || Date.now();
    localStorage.setItem('logicalWingStart', start);

    let elapsed = Date.now() - start;
    if (elapsed >= FILL_DURATION) {
      start = Date.now();
      localStorage.setItem('logicalWingStart', start);
      elapsed = 0;
    }

    const timePercent = (elapsed / FILL_DURATION) * 100;

    let branchPercent = 0;
    if (unlockedBranches.care) branchPercent += 33;
    if (unlockedBranches.grow) branchPercent += 33;
    if (unlockedBranches.ease) branchPercent += 34;

    animateProgress(
      progressFill,
      Math.min(timePercent + branchPercent, 100)
    );
  }

  if (progressContainer && progressFill) {
    progressContainer.style.display = 'block';
    setInterval(updateDashboardProgress, 1000);
  }

  /* ============================================================
     REWARDS PROGRESS
  ============================================================ */

  const rewards = [
    { fill: 'avalonCareFill', lock: 'avalonCareLocked', key: 'care', max: 33 },
    { fill: 'avalonGrowFill', lock: 'avalonGrowLocked', key: 'grow', max: 33 },
    { fill: 'avalonEaseFill', lock: 'avalonEaseLocked', key: 'ease', max: 34 }
  ];

  function animateProgress(el, target) {
    let current = parseFloat(el.style.width) || 0;

    function step() {
      if (current < target) {
        current = Math.min(current + 0.5, target);
        el.style.width = `${current}%`;
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function updateRewardsProgress() {
    if (!progressFill) return;

    const dashboardPercent =
      parseFloat(progressFill.style.width) || 0;

    rewards.forEach(r => {
      const fillEl = document.getElementById(r.fill);
      const lockEl = document.getElementById(r.lock);
      if (!fillEl || !lockEl) return;

      if (unlockedBranches[r.key]) {
        lockEl.style.display = 'none';
        animateProgress(fillEl, Math.min(dashboardPercent, r.max));
      } else {
        fillEl.style.width = '0%';
        lockEl.style.display = 'block';
      }
    });
  }

  setInterval(updateRewardsProgress, 1000);

  /* ============================================================
     TESTIMONIAL ROTATION
  ============================================================ */

  const testimonialItem =
    document.querySelector('#testimonialList li');

  if (testimonialItem) {
    const testimonials = [
      '“My shifts are demanding, and I don’t always have time to explore new options.” — Charlotte',
      '“As an educator, I value clarity and structure. This felt grounded.” — Emily',
      '“I finally saw progress without feeling overwhelmed.” — Ava'
    ];

    let index = 0;
    setInterval(() => {
      testimonialItem.classList.add('fade-out');
      setTimeout(() => {
        testimonialItem.textContent = testimonials[index];
        testimonialItem.classList.remove('fade-out');
        index = (index + 1) % testimonials.length;
      }, 800);
    }, 4000);
  }

  /* ============================================================
     COLLAPSIBLE INFO CARDS
  ============================================================ */

  function toggleInfo(id) {
    document.getElementById(id)?.classList.toggle('open');
  }
  window.toggleInfo = toggleInfo;

  /* ============================================================
     INITIAL SYNC
  ============================================================ */

  updateDashboardProgress();
  updateRewardsProgress();

});
