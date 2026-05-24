/* ============================================
   NEW AGE INSTITUTE OF FINE ARTS
   Premium JavaScript — Interactions & Animations
   ============================================ */

'use strict';

// ============================================
// NAVBAR — Scroll + Active Links + Mobile
// ============================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-link');

// Scroll → scrolled class
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
  toggleBackTop();
}, { passive: true });

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu on nav link click
navLinksItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active nav link based on scroll position
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinksItems.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ============================================
// PARTICLES IN HERO
// ============================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 30;
  const colors = ['rgba(194,65,12,0.4)', 'rgba(217,119,6,0.35)', 'rgba(124,58,237,0.2)', 'rgba(15,118,110,0.25)'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    const left = Math.random() * 100;
    const top  = Math.random() * 100;
    const dur  = Math.random() * 6 + 4;
    const delay = Math.random() * 8;
    const color = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%; top:${top}%;
      --dur:${dur}s; --delay:${delay}s;
      background:${color}; opacity:0;
      border-radius:50%;
    `;
    container.appendChild(p);
  }
}
createParticles();

// ============================================
// ANIMATED COUNTERS
// ============================================
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, step);
}

// ============================================
// INTERSECTION OBSERVER — Animations + Counters
// ============================================
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
};

// General animations
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseFloat(el.dataset.delay || 0) * 100;
      setTimeout(() => {
        el.classList.add('animated');
      }, delay);
      animObserver.unobserve(el);
    }
  });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

// Course & Feature cards (staggered)
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseFloat(entry.target.dataset.delay || 0) * 90;
      setTimeout(() => {
        entry.target.classList.add('animated');
      }, delay);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.course-card, .feat-card, .gallery-item').forEach(el => {
  cardObserver.observe(el);
});

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-target]').forEach(el => animateCounter(el));
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsBlock = document.querySelector('.hero-stats');
if (statsBlock) counterObserver.observe(statsBlock);

// ============================================
// TESTIMONIALS SLIDER
// ============================================
(function initSlider() {
  const track   = document.getElementById('testiTrack');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsContainer = document.getElementById('testiDots');

  if (!track || !prevBtn || !nextBtn) return;

  const cards   = track.querySelectorAll('.testi-card');
  const total   = cards.length;
  let current   = 0;
  let autoTimer = null;

  // Determine visible cards per slide
  function getVisible() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  // Build dots
  function buildDots() {
    dotsContainer.innerHTML = '';
    const vis = getVisible();
    const pages = Math.ceil(total / vis);
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i * vis));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const vis = getVisible();
    const page = Math.floor(current / vis);
    const dots = dotsContainer.querySelectorAll('.testi-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === page));
  }

  function getCardWidth() {
    const card = cards[0];
    if (!card) return 0;
    const style = window.getComputedStyle(card);
    const margin = parseFloat(style.marginRight) || 24;
    return card.offsetWidth + margin;
  }

  function goTo(index) {
    const vis = getVisible();
    const maxIndex = total - vis;
    current = Math.max(0, Math.min(index, maxIndex));
    const offset = current * (getCardWidth());
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  }

  function next() {
    const vis = getVisible();
    if (current + vis >= total) {
      goTo(0);
    } else {
      goTo(current + 1);
    }
  }

  function prev() {
    const vis = getVisible();
    if (current <= 0) {
      goTo(total - vis);
    } else {
      goTo(current - 1);
    }
  }

  prevBtn.addEventListener('click', () => { resetAuto(); prev(); });
  nextBtn.addEventListener('click', () => { resetAuto(); next(); });

  function startAuto() {
    autoTimer = setInterval(next, 4500);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Touch / swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { resetAuto(); diff > 0 ? next() : prev(); }
  });

  buildDots();
  startAuto();
  window.addEventListener('resize', () => { buildDots(); goTo(0); });
})();

// ============================================
// GALLERY FILTER
// ============================================
(function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items      = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      items.forEach(item => {
        const cat = item.dataset.category;
        if (filter === 'all' || cat === filter) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.pointerEvents = 'all';
        } else {
          item.style.opacity = '0.15';
          item.style.transform = 'scale(0.95)';
          item.style.pointerEvents = 'none';
        }
      });
    });
  });
})();

// ============================================
// ADMISSION FORM
// ============================================
(function initForm() {
  const form        = document.getElementById('admissionForm');
  const success     = document.getElementById('formSuccess');
  const submitBtn   = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name   = document.getElementById('studentName').value.trim();
    const phone  = document.getElementById('studentPhone').value.trim();
    const email  = document.getElementById('studentEmail').value.trim();
    const course = document.getElementById('courseSelect').value;

    if (!name || !phone || !email || !course) {
      shakeForm(form);
      return;
    }
    if (!isValidEmail(email)) {
      shakeField(document.getElementById('studentEmail'));
      return;
    }
    if (!isValidPhone(phone)) {
      shakeField(document.getElementById('studentPhone'));
      return;
    }

    // Simulate submission
    submitBtn.innerHTML = '<span>Sending...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('show');
    }, 1500);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function isValidPhone(phone) {
    return /^[\+\d\s\-\(\)]{8,}$/.test(phone);
  }
  function shakeForm(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.4s ease';
  }
  function shakeField(el) {
    el.style.borderColor = '#ff4d4d';
    el.style.boxShadow = '0 0 0 3px rgba(255,77,77,0.15)';
    el.focus();
    setTimeout(() => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }, 2000);
  }
})();

// Shake animation via JS style injection
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100%{ transform:translateX(0); }
    20%    { transform:translateX(-8px); }
    40%    { transform:translateX(8px); }
    60%    { transform:translateX(-6px); }
    80%    { transform:translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

// ============================================
// BACK TO TOP
// ============================================
const backTopBtn = document.getElementById('backTop');

function toggleBackTop() {
  if (window.scrollY > 400) {
    backTopBtn.classList.add('visible');
  } else {
    backTopBtn.classList.remove('visible');
  }
}

backTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ============================================
// SMOOTH SCROLL for all anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================
// CURSOR GLOW EFFECT (Desktop only)
// ============================================
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9999;
    width:350px; height:350px; border-radius:50%;
    background:radial-gradient(circle, rgba(194,65,12,0.04) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.15s ease, top 0.15s ease;
    left:-999px; top:-999px;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// ============================================
// FLOATING LABEL EFFECT on form inputs
// ============================================
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.classList.add('focused');
  });
  input.addEventListener('blur', () => {
    if (!input.value) input.parentElement.classList.remove('focused');
  });
});

// ============================================
// COURSE CARDS — 3D tilt effect (Desktop)
// ============================================
if (window.innerWidth > 768) {
  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================
// INIT on load
// ============================================
window.addEventListener('load', () => {
  updateActiveNav();
  toggleBackTop();
  // Trigger entrance animation for hero elements
  document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-cta, .hero-stats').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.8s ease ${i * 0.12}s, transform 0.8s ease ${i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 120);
  });
});

console.log('%c🎨 New Age Institute of Fine Arts', 'font-size:18px;color:#00d4ff;font-weight:bold;');
console.log('%cWebsite built with premium design & smooth animations.', 'color:#b0b8cc;');

// ============================================
// BFA PANEL — Bar animations + Counters
// ============================================
(function initBFAPanel() {
  // Animate university progress bars on scroll into view
  const bfaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate bars
        entry.target.querySelectorAll('.uni-bar-fill').forEach(bar => {
          const targetWidth = bar.style.width;
          bar.style.width = '0%';
          setTimeout(() => { bar.style.width = targetWidth; }, 200);
        });
        // Animate BFA stat counters
        entry.target.querySelectorAll('.bfa-stat-num[data-target]').forEach(el => {
          const target = parseInt(el.dataset.target, 10);
          const dur = 1800;
          const step = 16;
          const inc = target / (dur / step);
          let cur = 0;
          const t = setInterval(() => {
            cur += inc;
            if (cur >= target) { cur = target; clearInterval(t); }
            el.textContent = Math.floor(cur);
          }, step);
        });
        bfaObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  const bfaPanel = document.getElementById('bfa-panel');
  if (bfaPanel) bfaObserver.observe(bfaPanel);

  // Stagger uni-cards on scroll
  const uniCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.uni-card');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(24px)';
          setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 100);
        });
        uniCardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const uniGrid = document.querySelector('.uni-cards-grid');
  if (uniGrid) uniCardObserver.observe(uniGrid);
})();
