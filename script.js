'use strict';

// =============================================
// WELCOME MODAL — Theme Picker (Foot-in-the-Door)
// =============================================

const welcomeOverlay = document.getElementById('welcomeOverlay');
const siteContent = document.getElementById('siteContent');
const htmlEl = document.documentElement;

function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);

    // Fade out overlay
    welcomeOverlay.classList.add('hidden');

    // Unblur site content
    siteContent.classList.add('unblurred');

    // Remove overlay from DOM after its fade transition
    setTimeout(() => welcomeOverlay.remove(), 450);

    // After the 0.6s blur transition ends, remove filter entirely.
    // A filter:blur(0) still creates a stacking context that breaks
    // position:fixed centering for child modals.
    setTimeout(() => {
        siteContent.classList.remove('site-content-blurred', 'unblurred');
    }, 680);
}

document.getElementById('chooseLight').addEventListener('click', () => applyTheme('light'));
document.getElementById('chooseDark').addEventListener('click', () => applyTheme('dark'));

// =============================================
// CUSTOM CURSOR
// =============================================

const cursorRing = document.getElementById('cursorRing');
const cursorDot = document.getElementById('cursorDot');

let mouseX = -200, mouseY = -200;
let ringX = -200, ringY = -200;

function lerp(a, b, t) { return a + (b - a) * t; }

(function animateCursor() {
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
})();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

document.addEventListener('mouseleave', () => {
    cursorRing.style.opacity = '0';
    cursorDot.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursorRing.style.opacity = '';
    cursorDot.style.opacity = '';
});

const HOVERABLES = 'a, button, input, [role="button"], .friction-badge';
document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVERABLES)) document.body.classList.add('cursor-hover');
});
document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVERABLES)) document.body.classList.remove('cursor-hover');
});
document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));


// =============================================
// FRICTION SCORE (CLICK COUNTER)
// =============================================

const frictionCountEl = document.getElementById('frictionCount');
let clickCount = 0;

document.addEventListener('click', () => {
    clickCount++;
    frictionCountEl.textContent = clickCount;
    frictionCountEl.classList.remove('pop');
    void frictionCountEl.offsetWidth; // reflow to restart animation
    frictionCountEl.classList.add('pop');
    setTimeout(() => frictionCountEl.classList.remove('pop'), 300);
});


// =============================================
// MODAL ENGINE
// =============================================

const modalOverlay = document.getElementById('modalOverlay');

function showModal(id) {
    document.querySelectorAll('.modal').forEach(m => (m.style.display = 'none'));
    modalOverlay.classList.add('active');

    const target = document.getElementById(id);
    target.style.animation = 'none';
    void target.offsetWidth; // reflow
    target.style.animation = '';
    target.style.display = 'block';
}

function closeAll() {
    modalOverlay.classList.remove('active');
    document.querySelectorAll('.modal').forEach(m => (m.style.display = 'none'));
    surveyButtons.style.display = 'none';
    surveyResult.style.display = 'block';
    surveyResult.innerHTML = '✓ &nbsp;Your frustration has been logged. Have a nice&nbsp;day!';
}


// =============================================
// SURVEY — YES / NO
// =============================================

const surveyButtons = document.getElementById('surveyButtons');
const surveyResult = document.getElementById('surveyResult');

document.getElementById('btnYes').addEventListener('click', () => {
    surveyButtons.style.display = 'none';
    surveyResult.style.display = 'block';
    surveyResult.innerHTML = '✓ &nbsp;Thank you for your smooth&nbsp;feedback!';
});

document.getElementById('btnNo').addEventListener('click', () => showModal('modal1'));


// =============================================
// POPUP 1 — "Are you sure?"
// =============================================

document.getElementById('m1Yes').addEventListener('click', () => showModal('modal2'));
document.getElementById('m1No').addEventListener('click', () => showModal('modal2'));


// =============================================
// POPUP 2 — Type "NO" to confirm
// =============================================

const confirmInput = document.getElementById('confirmInput');
const m2Next = document.getElementById('m2Next');

confirmInput.addEventListener('input', () => {
    const isValid = confirmInput.value.trim() === 'NO';
    m2Next.disabled = !isValid;
    confirmInput.classList.toggle('valid', isValid);
});

m2Next.addEventListener('click', () => {
    if (m2Next.disabled) return;
    // reset field for next visit
    confirmInput.value = '';
    m2Next.disabled = true;
    confirmInput.classList.remove('valid');
    showModal('modal3');
});


// =============================================
// POPUP 3 — Discount offer
// =============================================

function goToLoader() {
    showModal('modal4');
    startLoader();
}

document.getElementById('m3Accept').addEventListener('click', goToLoader);
document.getElementById('m3Decline').addEventListener('click', (e) => {
    e.preventDefault();
    goToLoader();
});


// =============================================
// POPUP 4 — Spinner loader (3 s)
// =============================================

function startLoader() {
    const loaderIcon = document.getElementById('loaderIcon');
    const modal4Title = document.getElementById('modal4Title');
    const modal4Body = document.getElementById('modal4Body');
    const modal4Actions = document.getElementById('modal4Actions');

    // Reset to loading state
    loaderIcon.innerHTML = '<div class="spinner"></div>';
    modal4Title.textContent = 'Processing your negative energy…';
    modal4Body.textContent = 'Please wait while we log your dissatisfaction into our system.';
    modal4Actions.style.display = 'none';

    setTimeout(() => {
        loaderIcon.innerHTML = '✅';
        modal4Title.textContent = 'Processing Complete';
        modal4Body.textContent = 'Your negative energy has been recorded successfully.';
        modal4Actions.style.display = 'flex';
    }, 3000);
}

document.getElementById('m4Continue').addEventListener('click', () => showModal('modal5'));


// =============================================
// POPUP 5 — Final confirmation
// =============================================

document.getElementById('m5Close').addEventListener('click', closeAll);


// =============================================
// EASTER EGG — 1-Click Premium Reading Upgrade
// =============================================

const premiumBtn = document.getElementById('premiumBtn');
const premiumCta = document.getElementById('premiumCta');
const essayBody = document.querySelector('.essay-body');

premiumBtn.addEventListener('click', () => {
    // ── 1. Find the topmost visible paragraph to use as scroll anchor ──
    const paragraphs = document.querySelectorAll('.essay-body p, .pull-quote blockquote');
    let anchor = null;
    let anchorTop = 0;

    for (const el of paragraphs) {
        const rect = el.getBoundingClientRect();
        // pick the first element whose top is on-screen (or just above fold)
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            anchor = el;
            anchorTop = rect.top;   // distance from viewport top BEFORE reflow
            break;
        }
    }

    // ── 2. Apply premium mode (triggers reflow / layout shift) ──
    essayBody.classList.add('premium-mode');

    // ── 3. On next frame, measure how much the anchor moved and compensate ──
    requestAnimationFrame(() => {
        if (anchor) {
            const newTop = anchor.getBoundingClientRect().top;
            const delta = newTop - anchorTop;   // positive = content grew upward
            window.scrollBy({ top: delta, behavior: 'instant' });
        }

        // Replace button only after scroll correction so DOM mutation
        // doesn't interfere with the BoundingClientRect reads above
        premiumCta.innerHTML = '<span class="premium-activated-tag">✦ Premium Activated</span>';
    });
});


// =============================================
// SCROLL REVEAL
// =============================================

const revealTargets = document.querySelectorAll(
    '.essay-section, .pull-quote, .callout-box, .essay-footer, .survey-section'
);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = 'opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)';
    observer.observe(el);
});
