/* ═══════════════════════════════════════════════════
   SHAHEERA WEDDING — Main Script
   Particles · Scroll Reveals · Countdown · Nav · RSVP
   ═══════════════════════════════════════════════════ */

// ── PRELOADER — Star Collision ────────────────────
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const starLeft = document.getElementById('star-left');
  const starRight = document.getElementById('star-right');
  const glitch = document.getElementById('glitch-overlay');
  const flash = document.getElementById('flash-overlay');
  let hasTriggered = false;

  // Show stars after initial content fades in
  window.addEventListener('load', () => {
    setTimeout(() => {
      if(starLeft) starLeft.classList.add('visible');
      if(starRight) starRight.classList.add('visible');
    }, 1000);
  });

  // Wait for user tap/click to trigger collision
  preloader.addEventListener('click', () => {
    if (hasTriggered) return;
    hasTriggered = true;

    // Phase 1: Hide text, start collision
    preloader.classList.add('colliding');
    if(starLeft) starLeft.classList.add('collide');
    if(starRight) starRight.classList.add('collide');

    // Phase 2: Glitch effect as stars approach center (~75% of 1.3s)
    setTimeout(() => {
      if(glitch) glitch.classList.add('active');
    }, 750);

    // Phase 3: Flash burst at moment stars collapse together
    setTimeout(() => {
      if(flash) flash.classList.add('active');
    }, 975);

    // Phase 4: Hide preloader, reveal main site
    setTimeout(() => {
      preloader.style.pointerEvents = 'none';
      preloader.classList.add('hidden');
      triggerHeroAnimations();
    }, 1900);
  });
})();

function triggerHeroAnimations() {
  const heroEls = document.querySelectorAll('#hero .reveal-up');
  heroEls.forEach((el) => {
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('visible'), delay);
  });

  // Trigger star entrance animations
  const stars = document.querySelectorAll('.hero__star');
  stars.forEach((star) => {
    setTimeout(() => star.classList.add('hero__star--animate'), 600);
  });
}

// ── GOLD PARTICLE SYSTEM ──────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.fadeDir = Math.random() > 0.5 ? 1 : -1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeDir * 0.002;
      if (this.opacity <= 0.05 || this.opacity >= 0.5) this.fadeDir *= -1;
      if (this.x < -10 || this.x > w + 10 || this.y < -10 || this.y > h + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${this.opacity})`;
      ctx.fill();
    }
  }

  const count = Math.min(80, Math.floor((w * h) / 15000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── SCROLL REVEAL (IntersectionObserver) ──────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('visible'), delay);
        revealObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach((el) => {
  if (!el.closest('#hero')) revealObserver.observe(el);
});

// ── NAVIGATION ────────────────────────────────────
const nav = document.getElementById('main-nav');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });
}

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  navMenu.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => navMenu.classList.remove('open'));
  });
}

// Active nav link on scroll
const sections = document.querySelectorAll('.section[id]');
const navLinks = document.querySelectorAll('.nav__link[data-section]');

if (navLinks.length > 0) {
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 200;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });
}

// ── COUNTDOWN TIMER ───────────────────────────────
(function initCountdown() {
  const weddingDate = new Date('2026-07-19T11:30:00').getTime();
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-minutes');
  const secsEl = document.getElementById('cd-seconds');

  function pad(n, len = 2) { return String(n).padStart(len, '0'); }

  function update() {
    const now = Date.now();
    const diff = Math.max(0, weddingDate - now);
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (daysEl) daysEl.textContent = pad(d, 3);
    if (hoursEl) hoursEl.textContent = pad(h);
    if (minsEl) minsEl.textContent = pad(m);
    if (secsEl) secsEl.textContent = pad(s);
  }

  update();
  setInterval(update, 1000);
})();

// ── FIREBASE RSVP LOGIC ──────────────────────────────
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZgQPT_vP9gMZz6ic3nNe21AA8MdB3m6c",
  authDomain: "shaheera-9715d.firebaseapp.com",
  projectId: "shaheera-9715d",
  storageBucket: "shaheera-9715d.firebasestorage.app",
  messagingSenderId: "420899141655",
  appId: "1:420899141655:web:4902b7c3521c553bad4452"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const btnSubmit = document.getElementById('btn-submit-rsvp');
const guestNameInput = document.getElementById('guest-name');
const rsvpContainer = document.getElementById('rsvp-form-container');
const rsvpSuccess = document.getElementById('rsvp-success');
const yesBtn = document.getElementById('btn-yes');

if (btnSubmit && guestNameInput && rsvpContainer && rsvpSuccess && yesBtn) {
  btnSubmit.addEventListener('click', async () => {
    const name = guestNameInput.value.trim();
    if (!name) {
      guestNameInput.style.borderColor = 'rgba(244,63,94,0.8)';
      return;
    }
    
    const isAttending = yesBtn.classList.contains('active');
    
    btnSubmit.innerHTML = '<span>Sending...</span>';
    btnSubmit.style.pointerEvents = 'none';

    try {
      await addDoc(collection(db, "rsvps"), {
        name: name,
        attending: isAttending,
        timestamp: new Date()
      });
      
      rsvpContainer.style.display = 'none';
      rsvpSuccess.style.display = 'block';
      rsvpSuccess.classList.add('reveal-up', 'visible');
    } catch (e) {
      console.error("Error adding document: ", e);
      btnSubmit.innerHTML = '<span>Error. Try Again</span>';
      btnSubmit.style.pointerEvents = 'auto';
    }
  });
}

// ── SMOOTH SCROLL for anchor links ────────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── PARALLAX on hero (subtle) ─────────────────────
// Parallax removed from .hero__content to prevent text overlap with the transparent page-two section.
// (Text sliding down was colliding with the next section's text)
