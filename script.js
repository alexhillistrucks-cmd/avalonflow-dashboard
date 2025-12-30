document.addEventListener('DOMContentLoaded', () => {

    // ------------------- DEMO LOGIN -------------------
    function login() {
        const avalonFlowID = document.getElementById("AvalonFlowID")?.value;
        const password = document.getElementById("password")?.value;

        const demoAvalonFlowID = "AVF-2739XG-LUX78";
        const demoPassword = "avalon123";

        if (avalonFlowID === demoAvalonFlowID && password === demoPassword) {
            window.location.href = "dashboard.html";
        } else {
            const loginError = document.getElementById("loginError");
            if(loginError) loginError.innerText = "Access details not recognized. Please check and try again.";
        }
    }
    window.login = login; // make accessible globally

    // ------------------- LOGOUT -------------------
    function logout() {
        window.location.href = 'index.html';
    }
    window.logout = logout;

    // ------------------- SIDEBAR TOGGLE -------------------
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    function toggleSidebar() {
        if(sidebar) sidebar.classList.toggle('open');
        if(overlay) overlay.classList.toggle('active');
    }
    window.toggleSidebar = toggleSidebar;

    // ------------------- PARTICLE BACKGROUND -------------------
    const bg = document.getElementById('floating-bg');
    if(bg) {
        const colors = ['#6b2cd8','#9b59b6','#8e44ad'];
        function particle() {
            const p = document.createElement('div');
            p.className = 'particle';
            const s = Math.random() * 20 + 10;
            p.style.width = s + 'px';
            p.style.height = s + 'px';
            p.style.left = Math.random() * 100 + 'vw';
            p.style.background = `radial-gradient(circle, ${colors[Math.floor(Math.random() * colors.length)]}, transparent)`;
            p.style.animationDuration = (Math.random() * 20 + 10) + 's';
            bg.appendChild(p);
            setTimeout(() => p.remove(), 30000);
        }
        setInterval(particle, 800);
    }

    // ------------------- BRANCH UNLOCK / PAYMENTS -------------------
    const unlockedBranches = {};
    function unlockBranch(branch) {
        const links = {
            care: 'https://app.paymento.io/payment-link/aaf970b845624de0b5eea78726134e79',
            grow: 'https://app.paymento.io/payment-link/829c6748054a418f8226cb20387729f8',
            ease: 'https://app.paymento.io/payment-link/0ddcf9e099234b39ae2acbac693d527f'
        };

        if(links[branch]) window.open(links[branch], '_blank');
        unlockedBranches[branch] = true;

        updateRewardsProgress();
        updateDashboardProgress();
    }
    window.unlockBranch = unlockBranch;

    // ------------------- DASHBOARD PROGRESS -------------------
    const progressFill = document.getElementById('progressFill');
    const progressContainer = document.getElementById('progressContainer');

    function updateDashboardProgress() {
        if(!progressFill || !progressContainer) return;

        const fillDuration = 12 * 60 * 60 * 1000; // 12h
        let startTime = localStorage.getItem('logicalWingStart');
        if(!startTime) {
            startTime = Date.now();
            localStorage.setItem('logicalWingStart', startTime);
        } else startTime = parseInt(startTime);

        const now = Date.now();
        let elapsed = now - startTime;
        if(elapsed >= fillDuration) {
            startTime = now;
            localStorage.setItem('logicalWingStart', startTime);
            elapsed = 0;
        }

        const timeProgress = (elapsed / fillDuration) * 100;
        let branchProgress = 0;
        if(unlockedBranches.care) branchProgress += 33;
        if(unlockedBranches.grow) branchProgress += 33;
        if(unlockedBranches.ease) branchProgress += 34;

        const totalProgress = Math.min(timeProgress + branchProgress, 100);
        animateProgress(progressFill, totalProgress);
    }

    if(progressFill && progressContainer) {
        progressContainer.style.display = 'block';
        setInterval(updateDashboardProgress, 1000);
    }

    // ------------------- REWARDS PAGE -------------------
    const rewardsMapping = [
        {id: 'avalonCareFill', lockedId: 'avalonCareLocked', branch: 'care', maxPercent: 33},
        {id: 'avalonGrowFill', lockedId: 'avalonGrowLocked', branch: 'grow', maxPercent: 33},
        {id: 'avalonEaseFill', lockedId: 'avalonEaseLocked', branch: 'ease', maxPercent: 34}
    ];

    function animateProgress(element, targetPercent) {
        let current = parseFloat(element.style.width) || 0;
        const step = 0.5;
        function fillStep() {
            if(current < targetPercent) {
                current = Math.min(current + step, targetPercent);
                element.style.width = current + '%';
                requestAnimationFrame(fillStep);
            }
        }
        requestAnimationFrame(fillStep);
    }

    function updateRewardsProgress() {
        const dashboardFill = document.getElementById('progressFill');
        if(!dashboardFill) return;

        const currentDashboardPercent = parseFloat(dashboardFill.style.width) || 0;

        rewardsMapping.forEach(item => {
            const fill = document.getElementById(item.id);
            const lockedText = document.getElementById(item.lockedId);
            if(fill && lockedText) {
                if(unlockedBranches[item.branch]) {
                    lockedText.style.display = 'none';
                    const targetPercent = Math.min(currentDashboardPercent, item.maxPercent);
                    animateProgress(fill, targetPercent);
                } else {
                    fill.style.width = '0%';
                    lockedText.style.display = 'block';
                }
            }
        });
    }

    setInterval(updateRewardsProgress, 1000);

    // ------------------- TESTIMONIAL ROTATION -------------------
    const testimonialLi = document.querySelector('#testimonialList li');
    if(testimonialLi) {
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

    // ------------------- COLLAPSIBLE INFO CARDS -------------------
    function toggleInfo(id) {
        const card = document.getElementById(id);
        if(card) card.classList.toggle('open');
    }
    window.toggleInfo = toggleInfo;

    // ------------------- INITIAL SYNC -------------------
    updateDashboardProgress();
    updateRewardsProgress();

});
