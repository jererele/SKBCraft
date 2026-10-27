/* ==========================================================================
   SKB CRAFT — JAKE SINCLAIR STYLE ANIMATION ENGINE (V2.0 PRO)
   Smooth GSAP ScrollTrigger, Natural Stack, Top Drawer & Zero-Jank Mobile
   ========================================================================== */

let currentHeroCard = 0;
let heroStackTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initGsapAnimations();
  }

  initProgressBar();
  initTopDrawer();
  initHeroCardStack();
  initCalculator();
  initDossierModal();
  initSmoothScroll();
});

/* ==========================================================================
   SCROLL PROGRESS BAR
   ========================================================================== */
function initProgressBar() {
  const bar = document.getElementById('scrollProgressBar');
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
   TOP MOBILE DRAWER (SIDEBAR SUPERIOR)
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

  // Close when clicking any link inside drawer
  const links = drawer.querySelectorAll('a');
  links.forEach(l => l.addEventListener('click', close));

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
      close();
    }
  });

  // Nav scroll blur
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   HERO NATURAL CARD STACK & CAROUSEL
   ========================================================================== */
function initHeroCardStack() {
  window.switchHeroCard = function(index) {
    currentHeroCard = index;
    const cards = [
      document.getElementById('stackCard0'),
      document.getElementById('stackCard1'),
      document.getElementById('stackCard2'),
      document.getElementById('stackCard3')
    ];
    const dots = document.querySelectorAll('.stack-dot');

    if (!cards[0]) return;

    // Update dots
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });

    // Reorder cards cleanly
    const offsets = [
      { y: 0, scale: 1, opacity: 1, z: 4 },
      { y: -16, scale: 0.95, opacity: 0.85, z: 3 },
      { y: -30, scale: 0.90, opacity: 0.65, z: 2 },
      { y: -42, scale: 0.85, opacity: 0.45, z: 1 }
    ];

    cards.forEach((card, i) => {
      if (!card) return;
      const order = (i - index + 4) % 4;
      const config = offsets[order];

      gsap.to(card, {
        y: config.y,
        scale: config.scale,
        opacity: config.opacity,
        zIndex: config.z,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    resetHeroTimer();
  };

  function resetHeroTimer() {
    if (heroStackTimer) clearInterval(heroStackTimer);
    heroStackTimer = setInterval(() => {
      const next = (currentHeroCard + 1) % 4;
      window.switchHeroCard(next);
    }, 4500);
  }

  resetHeroTimer();
}

/* ==========================================================================
   GSAP & SCROLLTRIGGER ANIMATIONS (LIGHTWEIGHT & ULTRA SMOOTH)
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

  // Showcase Cards Expansion on Scroll (Smooth & Safe)
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
   INTERACTIVE CALCULATOR (MODELO 50/50)
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
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
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
      msg += `📌 *Tipo de Proyecto:* ${calcData.title}%0A`;
      msg += `💰 *Presupuesto Estimado:* $${formatNum(total)} ARS%0A`;
      msg += `🛡️ *Esquema 50/50:* Maqueta $0 ARS -> 1° Pago $${formatNum(half)} ARS al iniciar -> 2° Pago $${formatNum(half)} ARS en producción.%0A`;
      if (calcData.monthly > 0) {
        msg += `🔄 *Suscripción Mantenimiento:* $${formatNum(calcData.monthly)} ARS/mes%0A`;
      }
      msg += `⏱️ *Plazo estimado:* ~${calcData.days} días hábiles.%0A%0A¿Podemos coordinar para ver el prototipo inicial?`;

      window.open(`https://wa.me/5492945331018?text=${msg}`, '_blank', 'noopener,noreferrer');
    });
  }

  updateCalc();
}

function updateCalc() {
  const totalEl = document.getElementById('calcTotalVal');
  const firstEl = document.getElementById('calcHalfFirst');
  const secondEl = document.getElementById('calcHalfSecond');
  const daysEl = document.getElementById('calcDeliveryDays');

  if (!totalEl || !firstEl || !secondEl) return;

  const total = calcData.base + calcData.addons;
  const half = Math.round(total / 2);

  let formatted = `$${formatNum(total)} ARS`;
  if (calcData.monthly > 0) {
    formatted += ` <span style="font-size: 1.05rem; color: var(--accent-emerald);">+ $${formatNum(calcData.monthly)}/mes</span>`;
  }

  totalEl.innerHTML = formatted;
  firstEl.textContent = `$${formatNum(half)} ARS`;
  secondEl.textContent = `$${formatNum(half)} ARS`;

  if (daysEl) {
    daysEl.textContent = `Plazo estimado de entrega: ~${calcData.days} días hábiles`;
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
   DOSSIER PLAN DE NEGOCIOS MODAL
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
   SMOOTH SCROLL
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navOffset = 65;
        const pos = target.getBoundingClientRect().top + window.pageYOffset - navOffset;

        window.scrollTo({
          top: pos,
          behavior: 'smooth'
        });
      }
    });
  });
}
