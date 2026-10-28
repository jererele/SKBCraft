/* ==========================================================================
   SKB CRAFT — HIGH-PERFORMANCE WEB, 3D & CYBERSECURITY
   Boutique Studio Architecture • Mobile-First Engine • Zero-Jank
   ========================================================================== */

// Global state
let currentHeroCard = 0;
let heroStackTimer = null;

/* ==========================================================================
   DOM READY BOOTSTRAP
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // GSAP Registration
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGsapAnimations();
  }

  // Core features
  initProgressBar();
  initTopDrawer();
  initHeroCardStack();
  initCalculator();
  initDossierModal();
  initSmoothScroll();
  initHeroCanvas();
  initCardTilt();
});

/* ==========================================================================
   1. SCROLL PROGRESS BAR
   ========================================================================== */
function initProgressBar() {
  const bar = document.getElementById('scrollProgressLine');
  if (!bar) return;

  const onScroll = () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = window.scrollY / totalHeight;
      bar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   2. TOP MOBILE DRAWER (SIDEBAR SUPERIOR)
   ========================================================================== */
function initTopDrawer() {
  const toggleBtn = document.getElementById('btnToggleTopDrawer');
  const drawer = document.getElementById('mobileTopDrawer');
  const nav = document.getElementById('siteNav');
  const menuText = document.getElementById('menuBtnText');

  if (!toggleBtn || !drawer) return;

  const toggle = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      if (menuText) menuText.textContent = 'Menú';
    } else {
      drawer.classList.add('open');
      if (menuText) menuText.textContent = 'Cerrar';
    }
  };

  const close = () => {
    drawer.classList.remove('open');
    if (menuText) menuText.textContent = 'Menú';
  };

  toggleBtn.addEventListener('click', toggle);

  drawer.querySelectorAll('a').forEach(l => l.addEventListener('click', close));

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      close();
    }
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. HERO NATURAL CARD STACK & CAROUSEL (TOUCH SWIPE / DRAG ENABLED)
   ========================================================================== */
function initHeroCardStack() {
  const stage = document.getElementById('heroDeckStage');
  const cards = [
    document.getElementById('stackCard0'),
    document.getElementById('stackCard1'),
    document.getElementById('stackCard2'),
    document.getElementById('stackCard3')
  ];
  const dots = document.querySelectorAll('.stack-dot');

  if (!cards[0] || !stage) return;

  const offsets = [
    { y: 0, scale: 1, opacity: 1, z: 4 },
    { y: -16, scale: 0.95, opacity: 0.85, z: 3 },
    { y: -30, scale: 0.90, opacity: 0.65, z: 2 },
    { y: -42, scale: 0.85, opacity: 0.45, z: 1 }
  ];

  window.switchHeroCard = function(index) {
    currentHeroCard = (index + 4) % 4;

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentHeroCard);
    });

    cards.forEach((card, i) => {
      if (!card) return;
      const order = (i - currentHeroCard + 4) % 4;
      const config = offsets[order];

      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          x: 0,
          y: config.y,
          rotation: 0,
          scale: config.scale,
          opacity: config.opacity,
          zIndex: config.z,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        card.style.transform = `translate3d(0, ${config.y}px, 0) scale(${config.scale})`;
        card.style.opacity = config.opacity;
        card.style.zIndex = config.z;
      }
    });

    resetHeroTimer();
  };

  function resetHeroTimer() {
    if (heroStackTimer) clearInterval(heroStackTimer);
    heroStackTimer = setInterval(() => {
      const next = (currentHeroCard + 1) % 4;
      window.switchHeroCard(next);
    }, 5200);
  }

  // --- TOUCH / POINTER DRAG GESTURES (MOBILE FIRST) ---
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let deltaY = 0;
  let activeCard = null;

  function onPointerDown(e) {
    activeCard = cards[currentHeroCard];
    if (!activeCard) return;

    isDragging = true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    deltaX = 0;
    deltaY = 0;

    if (heroStackTimer) clearInterval(heroStackTimer);
    activeCard.classList.add('dragging');
  }

  function onPointerMove(e) {
    if (!isDragging || !activeCard) return;

    const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    deltaX = currentX - startX;
    deltaY = currentY - startY;

    // Follow finger with subtle rotation
    const rot = deltaX * 0.08;
    const scale = 1;

    if (typeof gsap !== 'undefined') {
      gsap.set(activeCard, {
        x: deltaX,
        y: deltaY,
        rotation: rot,
        scale: scale,
        overwrite: 'auto'
      });
    } else {
      activeCard.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0) rotate(${rot}deg) scale(${scale})`;
    }
  }

  function onPointerUp() {
    if (!isDragging || !activeCard) return;
    isDragging = false;
    activeCard.classList.remove('dragging');

    const threshold = 60; // px to trigger swipe

    if (deltaX > threshold) {
      // Swiped right -> go to previous card
      if (typeof gsap !== 'undefined') {
        gsap.to(activeCard, {
          x: 250,
          rotation: 18,
          opacity: 0,
          duration: 0.25,
          ease: 'power1.in',
          onComplete: () => {
            window.switchHeroCard(currentHeroCard - 1);
          }
        });
      } else {
        window.switchHeroCard(currentHeroCard - 1);
      }
    } else if (deltaX < -threshold) {
      // Swiped left -> go to next card
      if (typeof gsap !== 'undefined') {
        gsap.to(activeCard, {
          x: -250,
          rotation: -18,
          opacity: 0,
          duration: 0.25,
          ease: 'power1.in',
          onComplete: () => {
            window.switchHeroCard(currentHeroCard + 1);
          }
        });
      } else {
        window.switchHeroCard(currentHeroCard + 1);
      }
    } else {
      // Snap back if threshold not met
      if (typeof gsap !== 'undefined') {
        gsap.to(activeCard, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 0.35,
          ease: 'back.out(1.5)',
          onComplete: resetHeroTimer
        });
      } else {
        activeCard.style.transform = 'translate3d(0, 0, 0) scale(1)';
        resetHeroTimer();
      }
    }

    activeCard = null;
  }

  stage.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  resetHeroTimer();
}

/* ==========================================================================
   4. INTERACTIVE CYBER CANVAS (HERO PARTICLES & TOUCH RIPPLE)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroInteractiveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
  let height = (canvas.height = canvas.offsetHeight || 500);

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 28 : 55;
  const maxDistance = isMobile ? 85 : 125;

  const particles = [];
  const pointer = { x: -9999, y: -9999, active: false };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.55;
      this.vy = (Math.random() - 0.5) * 0.55;
      this.radius = Math.random() * 1.6 + 1.2;
      this.color = Math.random() > 0.6 ? '#00f0ff' : (Math.random() > 0.5 ? '#10b981' : '#c084fc');
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Pointer repulsion / touch ripple
      if (pointer.active) {
        const dx = pointer.x - this.x;
        const dy = pointer.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  const resize = () => {
    width = canvas.width = canvas.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.offsetHeight || 500;
  };
  window.addEventListener('resize', resize, { passive: true });

  const setPointer = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = clientX - rect.left;
    pointer.y = clientY - rect.top;
    pointer.active = true;
  };

  window.addEventListener('mousemove', (e) => setPointer(e.clientX, e.clientY), { passive: true });
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      setPointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  canvas.addEventListener('touchend', () => { pointer.active = false; }, { passive: true });

  let isCanvasVisible = true;
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(([entry]) => {
      isCanvasVisible = entry.isIntersecting;
    });
    obs.observe(canvas);
  }

  function loop() {
    if (isCanvasVisible) {
      ctx.clearRect(0, 0, width, height);

      // Connect lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Update & draw
      particles.forEach(p => {
        p.update();
        p.draw();
      });
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ==========================================================================
   5. CARD 3D PERSPECTIVE TILT
   ========================================================================== */
function initCardTilt() {
  if (window.innerWidth < 960) return; // Desktop mouse tilt only for crisp performance

  const cards = document.querySelectorAll('.jake-project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -2.5;
      const rotY = ((x - centerX) / centerX) * 2.5;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.008, 1.008, 1.008)`;
      card.style.transition = 'transform 0.1s ease-out';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.4s ease-out';
    });
  });
}

/* ==========================================================================
   6. GSAP & SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initGsapAnimations() {
  const isMobile = window.innerWidth < 768;

  // Hero Entrance
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });

  heroTl
    .from('.author-header-group', { y: 20, opacity: 0, delay: 0.1 })
    .from('.hero-main-title', { y: 30, opacity: 0 }, '-=0.6')
    .from('.hero-description', { y: 20, opacity: 0 }, '-=0.6')
    .from('.hero-btn-group', { y: 20, opacity: 0 }, '-=0.6')
    .from('.hero-micro-meta', { opacity: 0, duration: 0.5 }, '-=0.4')
    .from('.deck-showcase-stage', { scale: 0.92, opacity: 0, duration: 0.9, ease: 'power2.out' }, '-=0.6');

  // Showcase Cards Expansion on Scroll
  const showcasePairs = [
    { card: '#projectCard1', deck: '#deckShowcase1' },
    { card: '#projectCard2', deck: '#deckShowcase2' },
    { card: '#projectCard3', deck: '#deckShowcase3' }
  ];

  showcasePairs.forEach(({ card, deck }) => {
    const cardEl = document.querySelector(card);
    const deckEl = document.querySelector(deck);

    if (cardEl && deckEl) {
      gsap.fromTo(
        deckEl,
        { scale: 0.94 },
        {
          scrollTrigger: {
            trigger: cardEl,
            start: 'top 85%',
            end: 'center 50%',
            scrub: isMobile ? 0.3 : 0.6,
          },
          scale: 1.0,
          ease: 'power1.out'
        }
      );
    }
  });

  // Stagger reveal for Steps (Modelo 50/50)
  gsap.from('.editorial-step-card', {
    scrollTrigger: {
      trigger: '.editorial-number-grid',
      start: 'top 85%',
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out'
  });

  // Stagger reveal for Founders
  gsap.from('.founder-editorial-card', {
    scrollTrigger: {
      trigger: '.team-editorial-grid',
      start: 'top 85%',
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out'
  });
}

/* ==========================================================================
   7. INTERACTIVE CALCULATOR (MODELO 50/50 MOBILE-FIRST)
   ========================================================================== */
let calcData = {
  type: 'landing',
  base: 150000,
  days: 5,
  addons: 0,
  monthly: 0,
  title: 'Landing Page'
};

function initCalculator() {
  const typeBtns = document.querySelectorAll('.calc-btn-option');
  const checkboxes = document.querySelectorAll('.calc-checkbox-input');
  const whatsappBtn = document.getElementById('btnSendQuoteWhatsapp');

  if (!typeBtns.length) return;

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');

      calcData.type = btn.dataset.type;
      calcData.base = parseInt(btn.dataset.base, 10);
      calcData.days = parseInt(btn.dataset.days, 10);
      calcData.title = btn.querySelector('.calc-btn-title').textContent.trim();

      updateCalc();
    });
  });

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      let add = 0;
      let month = 0;

      checkboxes.forEach(box => {
        if (box.checked) {
          const val = parseInt(box.dataset.add, 10);
          if (box.dataset.isMonthly === 'true') {
            month += val;
          } else {
            add += val;
          }
        }
      });

      calcData.addons = add;
      calcData.monthly = month;
      updateCalc();
    });
  });

  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const total = calcData.base + calcData.addons;
      const half = Math.round(total / 2);

      let msg = `Hola equipo de SKB Craft! Estuve usando el cotizador de su web y quiero solicitar la Maqueta Inicial Cero Riesgo para mi proyecto:%0A%0A`;
      msg += `*Tipo de Proyecto:* ${calcData.title}%0A`;
      msg += `*Presupuesto Estimado:* $${formatNum(total)} ARS%0A`;
      msg += `*Esquema 50/50:* Maqueta $0 ARS -> 1° Pago $${formatNum(half)} ARS al iniciar código -> 2° Pago $${formatNum(half)} ARS en producción.%0A`;
      if (calcData.monthly > 0) {
        msg += `*Suscripción Mantenimiento:* $${formatNum(calcData.monthly)} ARS/mes%0A`;
      }
      msg += `*Plazo estimado:* ~${calcData.days} días hábiles.%0A%0A¿Podemos coordinar para ver el prototipo inicial?`;

      window.open(`https://wa.me/5492945331018?text=${msg}`, '_blank', 'noopener,noreferrer');
    });
  }

  updateCalc();
}

let animatedTotal = 150000;

function updateCalc() {
  const totalEl = document.getElementById('calcTotalVal');
  const firstEl = document.getElementById('calcHalfFirst');
  const secondEl = document.getElementById('calcHalfSecond');
  const daysEl = document.getElementById('calcDeliveryDays');

  if (!totalEl || !firstEl || !secondEl) return;

  const targetTotal = calcData.base + calcData.addons;
  const half = Math.round(targetTotal / 2);

  // Smooth number ticker with GSAP
  if (typeof gsap !== 'undefined') {
    const counter = { val: animatedTotal };
    gsap.to(counter, {
      val: targetTotal,
      duration: 0.35,
      ease: 'power1.out',
      onUpdate: () => {
        const cur = Math.round(counter.val);
        let formatted = `$${formatNum(cur)} ARS`;
        if (calcData.monthly > 0) {
          formatted += ` <span style="font-size: 0.95rem; color: var(--accent-emerald);">+ $${formatNum(calcData.monthly)}/mes</span>`;
        }
        totalEl.innerHTML = formatted;
      },
      onComplete: () => {
        animatedTotal = targetTotal;
      }
    });
  } else {
    let formatted = `$${formatNum(targetTotal)} ARS`;
    if (calcData.monthly > 0) {
      formatted += ` <span style="font-size: 0.95rem; color: var(--accent-emerald);">+ $${formatNum(calcData.monthly)}/mes</span>`;
    }
    totalEl.innerHTML = formatted;
  }

  firstEl.textContent = `$${formatNum(half)} ARS`;
  secondEl.textContent = `$${formatNum(half)} ARS`;

  if (daysEl) {
    daysEl.textContent = `Plazo estimado: ~${calcData.days} días hábiles`;
  }
}

function formatNum(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

window.selectServicePreset = function(typeKey) {
  const typeBtns = document.querySelectorAll('.calc-btn-option');
  let target = 'landing';
  if (typeKey === 'profesional') target = 'institucional';
  if (typeKey === 'ecommerce') target = 'ecommerce';

  typeBtns.forEach(btn => {
    if (btn.dataset.type === target) {
      btn.click();
    }
  });
};

/* ==========================================================================
   8. DOSSIER PLAN DE NEGOCIOS MODAL
   ========================================================================== */
function initDossierModal() {
  const modal = document.getElementById('dossierModal');
  const backdrop = document.getElementById('dossierBackdrop');
  const closeBtn = document.getElementById('btnCloseDossier');

  const triggers = [
    'btnOpenDossierNav',
    'btnDrawerOpenDossier',
    'btnFooterDossier'
  ];

  if (!modal) return;

  const open = (e) => {
    if (e) e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  triggers.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', open);
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (backdrop) backdrop.addEventListener('click', close);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      close();
    }
  });
}

/* ==========================================================================
   9. SMOOTH SCROLL
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navOffset = 70;
        const pos = target.getBoundingClientRect().top + window.pageYOffset - navOffset;

        window.scrollTo({
          top: pos,
          behavior: 'smooth'
        });
      }
    });
  });
}
