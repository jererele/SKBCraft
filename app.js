/* ==========================================================================
   SKB CRAFT — HIGH-PERFORMANCE WEB, 3D & CYBERSECURITY
   Boutique Studio Architecture • React 18 Mobile Components
   Interactive Edge Terminal • WhatsApp Live Simulator • Web Audio Haptics
   ========================================================================== */

// Global state
let currentHeroCard = 0;
let heroStackTimer = null;
let soundEngine = null;

/* ==========================================================================
   1. WEB AUDIO API SYNTHESIZER (TACTILE SOUND HAPTICS)
   ========================================================================== */
class WebAudioSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('skb_haptic_sound') === 'true';
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('skb_haptic_sound', this.enabled ? 'true' : 'false');
    if (this.enabled) {
      this.init();
      this.playClick(600, 'sine', 0.05);
    }
    return this.enabled;
  }

  playClick(freq = 700, type = 'sine', duration = 0.035) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or locked
    }
  }

  playKeystroke() {
    this.playClick(1100, 'triangle', 0.02);
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(840, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }
}

soundEngine = new WebAudioSoundEngine();

/* ==========================================================================
   2. DOM READY BOOTSTRAP
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
  initSoundToggle();
  initHeroCanvas();
  initCardTilt();

  // Mount React Components
  mountReactApps();
});

/* ==========================================================================
   3. SOUND TOGGLE BUTTON
   ========================================================================== */
function initSoundToggle() {
  const btn = document.getElementById('soundToggleBtn');
  const icon = document.getElementById('soundIcon');
  const label = document.getElementById('soundLabel');
  if (!btn) return;

  const updateUI = () => {
    if (soundEngine.enabled) {
      btn.classList.add('sound-on');
      if (icon) icon.textContent = '🔊';
      if (label) label.textContent = 'Haptic ON';
    } else {
      btn.classList.remove('sound-on');
      if (icon) icon.textContent = '🔇';
      if (label) label.textContent = 'Haptic OFF';
    }
  };

  btn.addEventListener('click', () => {
    soundEngine.toggle();
    updateUI();
  });

  updateUI();
}

/* ==========================================================================
   4. SCROLL PROGRESS BAR
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
   5. TOP MOBILE DRAWER (SIDEBAR SUPERIOR)
   ========================================================================== */
function initTopDrawer() {
  const toggleBtn = document.getElementById('btnToggleTopDrawer');
  const drawer = document.getElementById('mobileTopDrawer');
  const nav = document.getElementById('siteNav');
  const menuText = document.getElementById('menuBtnText');

  if (!toggleBtn || !drawer) return;

  const toggle = () => {
    soundEngine.playClick(750);
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

  drawer.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    soundEngine.playClick(650);
    close();
  }));

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
   6. HERO NATURAL CARD STACK & CAROUSEL
   ========================================================================== */
function initHeroCardStack() {
  window.switchHeroCard = function(index) {
    soundEngine.playClick(850, 'triangle', 0.025);
    currentHeroCard = index;
    const cards = [
      document.getElementById('stackCard0'),
      document.getElementById('stackCard1'),
      document.getElementById('stackCard2'),
      document.getElementById('stackCard3')
    ];
    const dots = document.querySelectorAll('.stack-dot');

    if (!cards[0]) return;

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });

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

      if (typeof gsap !== 'undefined') {
        gsap.to(card, {
          y: config.y,
          scale: config.scale,
          opacity: config.opacity,
          zIndex: config.z,
          duration: 0.45,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      } else {
        card.style.transform = `translateY(${config.y}px) scale(${config.scale})`;
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
    }, 4800);
  }

  resetHeroTimer();
}

/* ==========================================================================
   7. INTERACTIVE CYBER CANVAS (HERO PARTICLES & TOUCH RIPPLE)
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('heroInteractiveCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
  let height = (canvas.height = canvas.offsetHeight || 500);

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 32 : 55;
  const maxDistance = isMobile ? 85 : 125;

  const particles = [];
  const pointer = { x: -9999, y: -9999, active: false };

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.6 + 1.2;
      this.color = Math.random() > 0.6 ? '#00f0ff' : (Math.random() > 0.5 ? '#10b981' : '#c084fc');
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Pointer repulsion / ripple
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
      ctx.shadowBlur = 8;
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
   8. CARD 3D PERSPECTIVE TILT
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
   9. GSAP & SCROLLTRIGGER ANIMATIONS
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
   10. INTERACTIVE CALCULATOR (MODELO 50/50)
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
      soundEngine.playClick(720);
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
      soundEngine.playClick(cb.checked ? 880 : 440);
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
      soundEngine.playPop();
      const total = calcData.base + calcData.addons;
      const half = Math.round(total / 2);

      let msg = `Hola equipo de SKB Craft! Estuve usando el cotizador de su web y quiero solicitar la Maqueta Inicial Cero Riesgo para mi proyecto:%0A%0A`;
      msg += `📌 *Tipo de Proyecto:* ${calcData.title}%0A`;
      msg += `💰 *Presupuesto Estimado:* $${formatNum(total)} ARS%0A`;
      msg += `🛡️ *Esquema 50/50:* Maqueta $0 ARS -> 1° Pago $${formatNum(half)} ARS al iniciar código -> 2° Pago $${formatNum(half)} ARS en producción.%0A`;
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
  soundEngine.playClick(750);
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
   11. DOSSIER PLAN DE NEGOCIOS MODAL
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
    soundEngine.playClick(650);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    soundEngine.playClick(500);
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
   12. SMOOTH SCROLL
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        soundEngine.playClick(600);
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

/* ==========================================================================
   13. REACT 18 APPS: TERMINAL EDGE & WHATSAPP LIVE SIMULATOR
   ========================================================================== */
function mountReactApps() {
  if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
    console.warn('React CDN not loaded yet, skipping React mount');
    return;
  }

  const h = React.createElement;

  // --------------------------------------------------------------------------
  // REACT APP 1: SKBEdgeTerminal
  // --------------------------------------------------------------------------
  function SKBEdgeTerminal() {
    const [activeTab, setActiveTab] = React.useState('cli');
    const [inputVal, setInputVal] = React.useState('');
    const [fps, setFps] = React.useState(60);
    const [ping, setPing] = React.useState(22);
    const [history, setHistory] = React.useState([
      { cmd: 'system --status', out: 'SKB Craft Edge Node Online • Esquel, Chubut, Patagonia • Cloudflare CDN Active • 0.2s TTFB', type: 'success' },
      { cmd: 'help', out: 'Comandos disponibles: status, bench, certs, jeremias, modelo5050, matrix, clear', type: 'info' }
    ]);
    const historyEndRef = React.useRef(null);

    // Live FPS meter via requestAnimationFrame
    React.useEffect(() => {
      let frameCount = 0;
      let lastTime = performance.now();
      let animId;

      const calcFps = () => {
        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          setFps(Math.round((frameCount * 1000) / (now - lastTime)));
          frameCount = 0;
          lastTime = now;
          // Random ping jitter (19 - 28ms)
          setPing(Math.floor(19 + Math.random() * 9));
        }
        animId = requestAnimationFrame(calcFps);
      };
      animId = requestAnimationFrame(calcFps);

      return () => cancelAnimationFrame(animId);
    }, []);

    React.useEffect(() => {
      if (historyEndRef.current) {
        historyEndRef.current.scrollTop = historyEndRef.current.scrollHeight;
      }
    }, [history]);

    const executeCmd = (rawCmd) => {
      const cmd = rawCmd.trim().toLowerCase();
      if (!cmd) return;
      soundEngine.playKeystroke();

      if (cmd === 'clear') {
        setHistory([]);
        setInputVal('');
        return;
      }

      let output = '';
      let outType = 'info';

      switch (cmd) {
        case 'status':
          output = `[CLUSTER ONLINE]\n• Ubicación: Esquel, Chubut, Patagonia\n• Infraestructura: Edge Cloudflare + Vercel / Appwrite\n• Uptime: 99.98% Monitoreado\n• Latencia local: ~${ping}ms\n• Seguridad: WAF activo, blindaje SQL, sin WordPress hackeable`;
          outType = 'success';
          break;
        case 'bench':
          output = `[SCREEN & EDGE BENCHMARK]\n• FPS Pantalla: ${fps} FPS (${fps > 90 ? 'ProMotion 120Hz Detectado' : '60Hz Estable'})\n• Resolución: ${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}x\n• Conexión: ${(navigator.connection && navigator.connection.effectiveType) ? navigator.connection.effectiveType.toUpperCase() : 'Banda Ancha Fibra'}\n• TTFB Carga DOM: < 0.20s`;
          outType = 'success';
          break;
        case 'certs':
          output = `[CERTIFICACIONES MUNDIALES VERIFICADAS]\n1. IA & Deep Learning: Prompt Engineering & LLM Optimization (#CERT-AI-9942)\n2. Fullstack Dev: Next.js 15, React 18, Python & Appwrite Dynamic DB (#CERT-DEV-8821)\n3. Ciberseguridad: OWASP Top 10, Cloudflare WAF, Pentesting Defensivo (#CERT-SEC-7719)`;
          outType = 'success';
          break;
        case 'jeremias':
          output = `[JEREMÍAS SALONIO ROMANCHUK]\n• Rol: Director High-End & Backend, Infraestructura y Seguridad\n• Enfoque: Arquitectura cloud ultra-rápida, bases de datos blindadas y despliegue global\n• Contacto Directo: WhatsApp +54 9 2945 33-1018`;
          outType = 'info';
          break;
        case 'modelo5050':
        case '5050':
          output = `[PROTOCOLO 50/50 CERO RIESGO]\n• Paso 1: Maqueta previa gratis ($0 ARS de anticipo)\n• Paso 2: 50% al aprobar el prototipo e iniciar código final\n• Paso 3: 50% al entregar en producción verificado en Cloudflare`;
          outType = 'success';
          break;
        case 'matrix':
          output = `01001001 01000001 00100000 01000011 01010010 01000001 01000110 01010100\n[SKB_PATAGONIA_CYBER_LINK_ESTABLISHED]\n>>> 3D WebGL Engine & GameDev Roadmap Initiated...\n>>> Zero-Vulnerability Protocol Locked.`;
          outType = 'matrix-out';
          break;
        case 'help':
          output = `Comandos: status, bench, certs, jeremias, modelo5050, matrix, clear`;
          break;
        default:
          output = `Comando '${rawCmd}' no reconocido. Escribí 'help' para ver la lista.`;
          outType = 'info';
      }

      setHistory(prev => [...prev, { cmd: rawCmd, out: output, type: outType }]);
      setInputVal('');
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        executeCmd(inputVal);
      }
    };

    return h('div', { className: 'terminal-wrapper' },
      // Header
      h('div', { className: 'terminal-header' },
        h('div', { className: 'terminal-dots' },
          h('div', { className: 'terminal-dot dot-red' }),
          h('div', { className: 'terminal-dot dot-yellow' }),
          h('div', { className: 'terminal-dot dot-green' })
        ),
        h('div', { className: 'terminal-title-text' }, 'skb-edge-terminal ~ v2.6.4 (Patagonia Node)'),
        h('span', { className: 'pill-badge active-indicator', style: { padding: '0.2rem 0.55rem', fontSize: '0.68rem' } }, `Ping ${ping}ms`)
      ),

      // Tabs
      h('div', { className: 'terminal-tabs' },
        h('button', {
          className: `term-tab-btn ${activeTab === 'cli' ? 'active' : ''}`,
          onClick: () => { soundEngine.playClick(700); setActiveTab('cli'); }
        }, '>_ CLI Interactivo'),
        h('button', {
          className: `term-tab-btn ${activeTab === 'bench' ? 'active' : ''}`,
          onClick: () => { soundEngine.playClick(700); setActiveTab('bench'); }
        }, '⚡ Benchmark en Vivo'),
        h('button', {
          className: `term-tab-btn ${activeTab === 'certs' ? 'active' : ''}`,
          onClick: () => { soundEngine.playClick(700); setActiveTab('certs'); }
        }, '🛡️ Certificaciones Mundiales'),
        h('button', {
          className: `term-tab-btn ${activeTab === 'cloud' ? 'active' : ''}`,
          onClick: () => { soundEngine.playClick(700); setActiveTab('cloud'); }
        }, '📜 Respaldo 2026')
      ),

      // Body Content
      h('div', { className: 'terminal-body' },

        // TAB 1: CLI
        activeTab === 'cli' && h('div', { className: 'term-cli-wrap' },
          h('div', { className: 'term-cli-history', ref: historyEndRef },
            history.map((item, idx) =>
              h('div', { key: idx },
                h('div', { className: 'term-cmd-entry' },
                  h('span', { className: 'term-prompt' }, '$'),
                  h('span', null, item.cmd)
                ),
                h('div', { className: `term-cmd-output ${item.type}` }, item.out)
              )
            )
          ),

          // Input Line
          h('div', { className: 'term-input-line' },
            h('span', { className: 'term-prompt' }, '$'),
            h('input', {
              type: 'text',
              className: 'term-input-field',
              value: inputVal,
              placeholder: 'Escribí un comando (ej: status, bench, certs)...',
              onChange: (e) => setInputVal(e.target.value),
              onKeyDown: handleKeyDown
            }),
            h('button', {
              className: 'term-send-btn',
              onClick: () => executeCmd(inputVal)
            }, 'Ejecutar')
          ),

          // Quick Chips for mobile touch
          h('div', { className: 'term-quick-chips' },
            ['status', 'bench', 'certs', 'jeremias', 'modelo5050', 'matrix', 'clear'].map((c) =>
              h('button', {
                key: c,
                className: 'term-chip',
                onClick: () => executeCmd(c)
              }, `+ ${c}`)
            )
          )
        ),

        // TAB 2: BENCHMARK
        activeTab === 'bench' && h('div', null,
          h('div', { style: { fontSize: '0.85rem', color: 'var(--accent-cream)', marginBottom: '0.75rem' } },
            'Diagnóstico del dispositivo y rendimiento en tiempo real:'
          ),
          h('div', { className: 'bench-grid' },
            h('div', { className: 'bench-card' },
              h('span', { className: 'bench-label' }, 'Tasa Refresco'),
              h('span', { className: 'bench-val', style: { color: fps > 75 ? 'var(--accent-cyan)' : 'var(--accent-emerald)' } }, `${fps} FPS`),
              h('span', { className: 'bench-sub' }, fps > 75 ? 'Pantalla 120Hz ProMotion' : 'Estable 60Hz nativo')
            ),
            h('div', { className: 'bench-card' },
              h('span', { className: 'bench-label' }, 'Latencia Edge'),
              h('span', { className: 'bench-val', style: { color: 'var(--accent-cyan)' } }, `${ping} ms`),
              h('span', { className: 'bench-sub' }, 'Cloudflare Node EZE/SCL')
            ),
            h('div', { className: 'bench-card' },
              h('span', { className: 'bench-label' }, 'Carga Inicial'),
              h('span', { className: 'bench-val', style: { color: 'var(--accent-emerald)' } }, '< 0.20 s'),
              h('span', { className: 'bench-sub' }, 'Sin peso de WordPress')
            ),
            h('div', { className: 'bench-card' },
              h('span', { className: 'bench-label' }, 'Blindaje 50/50'),
              h('span', { className: 'bench-val', style: { color: 'var(--accent-cream)' } }, 'ACTIVO'),
              h('span', { className: 'bench-sub' }, 'Cero riesgo financiero')
            )
          )
        ),

        // TAB 3: CERTIFICACIONES
        activeTab === 'certs' && h('div', null,
          h('div', { style: { fontSize: '0.85rem', color: 'var(--accent-cream)', marginBottom: '0.75rem' } },
            'Acreditaciones y certificaciones de competencia técnica internacional:'
          ),
          h('div', { className: 'certs-badge-list' },
            h('div', { className: 'cert-entry-item' },
              h('div', { className: 'cert-meta-left' },
                h('span', { className: 'cert-title-txt' }, '1. Certificación Mundial en IA & Prompt Engineering'),
                h('span', { className: 'cert-hash-txt' }, 'Hash: sha256:4a8f9c2d1e... • Optimización de código con LLMs avanzados')
              ),
              h('span', { className: 'cert-verified-pill' }, '✓ VERIFICADO')
            ),
            h('div', { className: 'cert-entry-item' },
              h('div', { className: 'cert-meta-left' },
                h('span', { className: 'cert-title-txt' }, '2. Certificación en Programación React & Cloud DB'),
                h('span', { className: 'cert-hash-txt' }, 'Hash: sha256:7b3e1a90cc... • Next.js, bases dinámicas Appwrite y PostgreSQL')
              ),
              h('span', { className: 'cert-verified-pill' }, '✓ VERIFICADO')
            ),
            h('div', { className: 'cert-entry-item' },
              h('div', { className: 'cert-meta-left' },
                h('span', { className: 'cert-title-txt' }, '3. Certificación en Ciberseguridad & Pentesting Defensivo'),
                h('span', { className: 'cert-hash-txt' }, 'Hash: sha256:0d91fa77ee... • WAF Cloudflare, mitigación DDoS y cifrado E2E')
              ),
              h('span', { className: 'cert-verified-pill' }, '✓ VERIFICADO')
            )
          )
        ),

        // TAB 4: RESPALDO 2026
        activeTab === 'cloud' && h('div', null,
          h('div', { style: { fontSize: '0.85rem', color: 'var(--accent-cream)', marginBottom: '0.5rem' } },
            'Plan de Contingencia & Resiliencia Operativa (Esquel, Patagonia):'
          ),
          h('p', { style: { fontSize: '0.82rem', lineHeight: '1.6', color: '#cbd5e1' } },
            'En caso de cortes de energía o climas extremos en la cordillera, cada línea de código de SKB Craft se versiona automáticamente en repositorios cloud (GitHub/GitLab). Las páginas de nuestros clientes están alojadas en los centros de datos distribuidos mundialmente de Cloudflare, garantizando un Uptime 99.98% ininterrumpido sin depender de servidores caseros locales.'
          )
        )
      )
    );
  }

  // --------------------------------------------------------------------------
  // REACT APP 2: SKBWhatsAppSimulator
  // --------------------------------------------------------------------------
  function SKBWhatsAppSimulator() {
    const [messages, setMessages] = React.useState([
      {
        id: 1,
        sender: 'skb',
        text: '¡Hola! 👋 Soy Jeremías Salonio, Director High-End de SKB Craft. Trabajamos con el Modelo 50/50: te preparamos la maqueta previa de tu web 100% gratis. Si te gusta, pagás el 50% para arrancar el código final.',
        time: '12:00',
        isAudio: false
      },
      {
        id: 2,
        sender: 'skb',
        text: 'Escuchá este breve audio de 14s donde te cuento cómo blindamos tu inversión:',
        time: '12:01',
        isAudio: true,
        duration: '0:14'
      }
    ]);

    const [inputText, setInputText] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);
    const [audioProgress, setAudioProgress] = React.useState(0);
    const chatFeedRef = React.useRef(null);

    React.useEffect(() => {
      if (chatFeedRef.current) {
        chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
      }
    }, [messages, isTyping]);

    // Simulated Voice Note Playback
    React.useEffect(() => {
      let interval;
      if (isPlayingAudio) {
        interval = setInterval(() => {
          soundEngine.playClick(400, 'sine', 0.015);
          setAudioProgress(prev => {
            if (prev >= 14) {
              setIsPlayingAudio(false);
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
      return () => clearInterval(interval);
    }, [isPlayingAudio]);

    const toggleAudio = () => {
      soundEngine.playClick(600);
      if (isPlayingAudio) {
        setIsPlayingAudio(false);
      } else {
        setIsPlayingAudio(true);
        if (audioProgress >= 14) setAudioProgress(0);
      }
    };

    const triggerReply = (replyText, delay = 800) => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        soundEngine.playPop();
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setMessages(prev => [
          ...prev,
          { id: Date.now(), sender: 'skb', text: replyText, time: timeStr, isAudio: false }
        ]);
      }, delay);
    };

    const handleSendMessage = (textToSend) => {
      const txt = (textToSend || inputText).trim();
      if (!txt) return;

      soundEngine.playKeystroke();
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      setMessages(prev => [
        ...prev,
        { id: Date.now(), sender: 'user', text: txt, time: timeStr, isAudio: false }
      ]);
      setInputText('');

      // Smart dynamic responses
      const lower = txt.toLowerCase();
      if (lower.includes('maqueta') || lower.includes('50/50') || lower.includes('gratis')) {
        triggerReply('¡Exacto! Te armamos un prototipo funcional sin costo alguno. Solo si te convence abonás la primera mitad ($0 riesgo). ¿Querés que coordinemos para tu negocio?');
      } else if (lower.includes('precio') || lower.includes('cuanto') || lower.includes('costo') || lower.includes('landing')) {
        triggerReply('Nuestras landing pages de alta conversión arrancan en $100.000 ARS, y webs completas en $350.000 ARS. Usá el cotizador de la web para ver el desglose en tiempo real.');
      } else if (lower.includes('ecommerce') || lower.includes('tienda') || lower.includes('mercadopago')) {
        triggerReply('¡Buenísimo! Integramos MercadoPago, PayPal y Stripe con pasarelas encriptadas SSL y base de datos Appwrite. Cero comisiones abusivas.');
      } else if (lower.includes('3d') || lower.includes('juego') || lower.includes('videojuego')) {
        triggerReply('¡Esa es nuestra pasión a futuro! Proyectamos experiencias inmersivas 3D con Three.js / WebGL y el desarrollo de videojuegos propios con motores gráficos de última generación.');
      } else if (lower.includes('seguridad') || lower.includes('hack')) {
        triggerReply('No usamos plantillas vulnerables de WordPress. Blindamos todo con Cloudflare WAF, pentesting defensivo y certificados de seguridad mundiales.');
      } else {
        triggerReply('¡Excelente consulta! Escribinos directamente al WhatsApp 2945-331018 y Jeremías o Aron te responden en menos de 15 minutos.');
      }
    };

    return h('div', { className: 'whatsapp-sim-card' },
      // Header
      h('div', { className: 'wa-sim-header' },
        h('div', { className: 'wa-sim-profile' },
          h('div', { className: 'wa-sim-avatar' }, 'SKB'),
          h('div', null,
            h('div', { className: 'wa-sim-name' },
              'SKB Craft Studio',
              h('span', { className: 'wa-verified-badge', title: 'Agencia Verificada' },
                h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: '#25D366' },
                  h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' })
                )
              )
            ),
            h('div', { className: 'wa-sim-status' }, 'Jeremías (Dir. High-End), Aron & Nico • en línea')
          )
        ),
        h('div', { style: { display: 'flex', gap: '0.65rem', color: 'var(--text-dim)' } },
          h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 },
            h('path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' })
          )
        )
      ),

      // Chat Messages Feed
      h('div', { className: 'wa-messages-container', ref: chatFeedRef },
        messages.map((m) =>
          h('div', {
            key: m.id,
            className: `wa-msg ${m.sender === 'user' ? 'wa-msg-out' : 'wa-msg-in'}`
          },
            m.isAudio ?
              h('div', { className: 'wa-voice-bubble' },
                h('button', {
                  className: 'wa-voice-play-btn',
                  onClick: toggleAudio,
                  'aria-label': isPlayingAudio ? 'Pausar audio' : 'Reproducir audio'
                },
                  isPlayingAudio ?
                    h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: '#08090b' },
                      h('rect', { x: 6, y: 4, width: 4, height: 16 }),
                      h('rect', { x: 14, y: 4, width: 4, height: 16 })
                    ) :
                    h('svg', { width: 14, height: 14, viewBox: '0 0 24 24', fill: '#08090b' },
                      h('polygon', { points: '5 3 19 12 5 21 5 3' })
                    )
                ),
                h('div', { className: 'wa-waveform-container' },
                  [12, 22, 16, 28, 14, 24, 18, 30, 20, 15, 26, 18, 28, 14, 22, 10, 18, 8].map((hVal, i) =>
                    h('div', {
                      key: i,
                      className: `wa-wave-bar ${isPlayingAudio ? 'playing' : ''}`,
                      style: { height: `${hVal}px`, animationDelay: `${i * 0.05}s` }
                    })
                  )
                ),
                h('span', { className: 'wa-voice-time' },
                  isPlayingAudio ? `0:${String(audioProgress).padStart(2, '0')}` : m.duration
                )
              ) :
              h('div', null, m.text),

            h('div', { className: 'wa-msg-time' },
              m.time,
              m.sender === 'user' && h('span', { style: { color: '#38bdf8', marginLeft: '4px' } }, ' ✓✓')
            )
          )
        ),

        // Typing indicator
        isTyping && h('div', { className: 'wa-typing-indicator' },
          h('div', { className: 'wa-typing-dot' }),
          h('div', { className: 'wa-typing-dot' }),
          h('div', { className: 'wa-typing-dot' })
        )
      ),

      // Quick Chips (Horizontal Scroll on Mobile)
      h('div', { className: 'wa-quick-chips' },
        [
          '🛡️ ¿Cómo es la maqueta gratis 50/50?',
          '💳 Quiero tienda con MercadoPago',
          '⚡ ¿Qué velocidad de carga tienen?',
          '🎮 ¿Qué harán en 3D y videojuegos?',
          '📲 Hablar directo al 2945-331018'
        ].map((chip) =>
          h('button', {
            key: chip,
            className: 'wa-chip-btn',
            onClick: () => handleSendMessage(chip)
          }, chip)
        )
      ),

      // Input Bottom Bar
      h('div', { className: 'wa-input-bottom-bar' },
        h('input', {
          type: 'text',
          className: 'wa-input-text',
          placeholder: 'Escribí un mensaje a SKB Craft...',
          value: inputText,
          onChange: (e) => setInputText(e.target.value),
          onKeyDown: (e) => { if (e.key === 'Enter') handleSendMessage(); }
        }),
        h('button', {
          className: 'wa-send-circle-btn',
          onClick: () => handleSendMessage(),
          'aria-label': 'Enviar mensaje'
        },
          h('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: '#08090b', strokeWidth: 2.2 },
            h('line', { x1: 22, y1: 2, x2: 11, y2: 13 }),
            h('polygon', { points: '22 2 15 22 11 13 2 9 22 2' })
          )
        )
      ),

      // WhatsApp Direct Link Banner
      h('div', { className: 'wa-direct-action-banner' },
        h('span', { style: { color: 'var(--text-dim)' } }, '¿Preferís charlar en tu app de WhatsApp?'),
        h('a', {
          href: 'https://wa.me/5492945331018?text=Hola%20Jerem%C3%ADas%20y%20equipo%20de%20SKB%20Craft,%20quiero%20solicitar%20la%20maqueta%20inicial%20gratis',
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'wa-direct-link-btn'
        },
          h('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'currentColor' },
            h('path', { d: 'M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z' })
          ),
          'Abrir en WhatsApp (2945-331018)'
        )
      )
    );
  }

  // Mount SKBEdgeTerminal
  const terminalMount = document.getElementById('reactTerminalMount');
  if (terminalMount) {
    const root = ReactDOM.createRoot(terminalMount);
    root.render(h(SKBEdgeTerminal));
  }

  // Mount SKBWhatsAppSimulator
  const whatsappMount = document.getElementById('reactWhatsappMount');
  if (whatsappMount) {
    const root = ReactDOM.createRoot(whatsappMount);
    root.render(h(SKBWhatsAppSimulator));
  }
}
