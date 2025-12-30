// ==================== AvalonFlow Script ====================
document.addEventListener('DOMContentLoaded', () => {

  // ------------------- DEMO LOGIN -------------------
  function login() {
    const avalonFlowID = document.getElementById("AvalonFlowID")?.value;
    const password = document.getElementById("password")?.value;

    const demoAvalonFlowID = "AVF-2739XG-LUX78";
    const demoPassword = "avalon123";

    if (avalonFlowID === demoAvalonFlowID && password === demoPassword) {
      localStorage.setItem('loggedIn', 'true'); // store login state
      window.location.href = "dashboard.html";
    } else {
      const loginError = document.getElementById("loginError");
      if (loginError) loginError.innerText = "Access details not recognized. Please check and try again.";
    }
  }
  window.login = login;

  // ------------------- LOGOUT -------------------
  function logout() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'index.html';
  }
  window.logout = logout;

  // ------------------- PAGE ACCESS CONTROL -------------------
  if (document.body.dataset.requiresLogin === "true") {
    if (localStorage.getItem('loggedIn') !== 'true') {
      window.location.href = 'index.html';
    }
  }

  // ------------------- SIDEBAR TOGGLE -------------------
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  function toggleSidebar() {
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  }
  window.toggleSidebar = toggleSidebar;

  // ------------------- PARTICLE BACKGROUND -------------------
  const bg = document.getElementById('floating-bg');
  if (bg) {
    const colors = ['#6b2cd8','#9b59b6','#8e44ad'];
    const totalParticles = 40;

    function createParticle() {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random()*15 + 10;
      p.style.width = p.style.height = size+'px';
      p.style.left = Math.random()*100 + 'vw';
      p.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random()*colors.length)]}, transparent)`;
      p.style.animationDuration = (Math.random()*15 + 10) + 's';
      bg.appendChild(p);
      setTimeout(() => p.remove(), 25000);
    }

    for(let i=0;i<totalParticles;i++) setTimeout(createParticle, i*150);
    setInterval(createParticle, 1000);
  }

  // ------------------- BRANCH & REWARDS -------------------
  const unlockedBranches = {};

  function unlockBranch(branch) {
    const links = {
      care: 'https://app.paymento.io/payment-link/aaf970b845624de0b5eea78726134e79',
      grow: 'https://app.paymento.io/payment-link/829c6748054a418f8226cb20387729f8',
      ease: 'https://app.paymento.io/payment-link/0ddcf9e099234b39ae2acbac693d527f'
    };
    if (links[branch]) window.open(links[branch], '_blank');
    unlockedBranches[branch] = true;
    updateRewardsProgress();
    updateDashboardProgress();
  }
  window.unlockBranch = unlockBranch;

  // ------------------- DASHBOARD PROGRESS -------------------
  const progressFill = document.getElementById('progressFill');
  const progressContainer = document.getElementById('progressContainer');

  function updateDashboardProgress() {
    if (!progressFill || !progressContainer) return;

    const fillDuration = 12*60*60*1000; // 12 hours
    let startTime = parseInt(localStorage.getItem('logicalWingStart')) || Date.now();
    localStorage.setItem('logicalWingStart', startTime);

    let elapsed = Date.now() - startTime;
    if (elapsed >= fillDuration) {
      startTime = Date.now();
      localStorage.setItem('logicalWingStart', startTime);
      elapsed = 0;
    }

    let timeProgress = (elapsed / fillDuration) * 100;
    let branchProgress = 0;
    if (unlockedBranches.care) branchProgress += 33;
    if (unlockedBranches.grow) branchProgress += 33;
    if (unlockedBranches.ease) branchProgress += 34;

    animateProgress(progressFill, Math.min(timeProgress + branchProgress, 100));
  }

  if (progressFill && progressContainer) {
    progressContainer.style.display = 'block';
    setInterval(updateDashboardProgress, 1000);
  }

  // ------------------- REWARDS -------------------
  const rewardsMapping = [
    {id:'avalonCareFill', lockedId:'avalonCareLocked', branch:'care', maxPercent:33},
    {id:'avalonGrowFill', lockedId:'avalonGrowLocked', branch:'grow', maxPercent:33},
    {id:'avalonEaseFill', lockedId:'avalonEaseLocked', branch:'ease', maxPercent:34}
  ];

  function animateProgress(el, target) {
    let current = parseFloat(el.style.width) || 0;
    const step = 0.5;
    function stepFn() {
      if(current < target) {
        current = Math.min(current + step, target);
        el.style.width = current + '%';
        requestAnimationFrame(stepFn);
      }
    }
    requestAnimationFrame(stepFn);
  }

  function updateRewardsProgress() {
    const dashboardFill = document.getElementById('progressFill');
    if (!dashboardFill) return;
    const currentPercent = parseFloat(dashboardFill.style.width) || 0;

    rewardsMapping.forEach(item => {
      const fill = document.getElementById(item.id);
      const locked = document.getElementById(item.lockedId);
      if (fill && locked) {
        if (unlockedBranches[item.branch]) {
          locked.style.display = 'none';
          animateProgress(fill, Math.min(currentPercent, item.maxPercent));
        } else {
          fill.style.width = '0%';
          locked.style.display = 'block';
        }
      }
    });
  }
  setInterval(updateRewardsProgress, 1000);

  // ------------------- TESTIMONIAL ROTATION -------------------
  const testimonialLi = document.querySelector('#testimonialList li');
  if (testimonialLi) {
    const testimonials = [
      "“My shifts are demanding, and I don’t always have time to explore new options. What stood out for me was how simple and structured this felt.” — Charlotte",
      "“As an educator, I value clarity and systems that make sense. This felt grounded and realistic.” — Emily",
      "“I finally saw progress without feeling overwhelmed.” — Ava"
    ];
    let tIndex = 0;
    setInterval(() => {
      testimonialLi.classList.add('fade-out');
      setTimeout(() => {
        testimonialLi.innerText = testimonials[tIndex];
        testimonialLi.classList.remove('fade-out');
        tIndex = (tIndex + 1) % testimonials.length;
      }, 800);
    }, 4000);
  }

  // ------------------- COLLAPSIBLE CARDS -------------------
  function toggleInfo(id) {
    const card = document.getElementById(id);
    if (card) card.classList.toggle('open');
  }
  window.toggleInfo = toggleInfo;

  // ------------------- INITIAL SYNC -------------------
  updateDashboardProgress();
  updateRewardsProgress();

});
