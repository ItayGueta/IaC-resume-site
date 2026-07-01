/* ========================================================================
   Particle Network — canvas background for hero
   ======================================================================== */

(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouse = { x: -9999, y: -9999 };
  let nodes = [];
  let particles = [];
  const NODE_COUNT = 24;
  const CONNECTION_DIST = 180;
  const MOUSE_RADIUS = 150;
  const MOUSE_FORCE = 0.6;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  function createNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2.5 + 1.5,
        hue: [220, 245, 260, 270, 190][Math.floor(Math.random() * 5)],
      });
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push(createParticle());
    }
  }

  function createParticle(onEdge) {
    if (nodes.length < 2) return null;
    // Pick two distinct nodes
    let a, b;
    do {
      a = nodes[Math.floor(Math.random() * nodes.length)];
      b = nodes[Math.floor(Math.random() * nodes.length)];
    } while (a === b && nodes.length > 1);
    if (a === b) return null;
    const t = onEdge ? Math.random() : 0;
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t,
      from: a,
      to: b,
      t: t,
      speed: 0.002 + Math.random() * 0.006,
      radius: 1 + Math.random() * 1.5,
      hue: a.hue,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = 1 - dist / CONNECTION_DIST;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(100, 140, 255, ${alpha * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Update and draw nodes
    for (const n of nodes) {
      // Mouse repulsion
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * MOUSE_FORCE;
        n.vx += (dx / dist) * force;
        n.vy += (dy / dist) * force;
      }

      // Damping
      n.vx *= 0.98;
      n.vy *= 0.98;

      // Add tiny random drift
      n.vx += (Math.random() - 0.5) * 0.02;
      n.vy += (Math.random() - 0.5) * 0.02;

      n.x += n.vx;
      n.y += n.vy;

      // Wrap edges
      if (n.x < -20) n.x = width + 20;
      if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = height + 20;
      if (n.y > height + 20) n.y = -20;

      // Draw node
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${n.hue}, 70%, 65%, 0.8)`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${n.hue}, 70%, 65%, 0.12)`;
      ctx.fill();
    }

    // Update and draw traveling particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (!p) { particles.splice(i, 1); continue; }
      p.t += p.speed;
      if (p.t >= 1) {
        const fresh = createParticle(true);
        if (fresh) particles[i] = fresh;
        else particles.splice(i, 1);
        continue;
      }
      p.x = p.from.x + (p.to.x - p.from.x) * p.t;
      p.y = p.from.y + (p.to.y - p.from.y) * p.t;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 75%, 0.9)`;
      ctx.fill();
    }

    // Ensure we always have enough particles
    while (particles.length < 40) {
      const p = createParticle(true);
      if (p) particles.push(p);
    }

    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  // Touch support
  canvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }, { passive: false });

  canvas.addEventListener('touchend', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  window.addEventListener('resize', function () {
    resize();
    createNodes();
  });

  resize();
  createNodes();
  createParticles();
  draw();
})();

/* ========================================================================
   Typewriter — hero headline
   ======================================================================== */

(function () {
  'use strict';

  var el = document.getElementById('hero-typewriter');
  if (!el) return;

  var defaultPhrases = [
    'I Orchestrate.',
    'I Compose.',
    'I Automate.',
    'I Ship.',
  ];

  var phraseIndex = 0;
  var charIndex = 0;
  var isDeleting = false;
  var timeout;
  var lastBuzzState = false;

  function getPhrases() {
    return (window.__buzzwordPhrases && window.__buzzwordPhrases.length)
      ? window.__buzzwordPhrases
      : defaultPhrases;
  }

  function type() {
    var phrases = getPhrases();
    var buzzNow = document.body.classList.contains('buzzword-mode');

    // Reset if buzzword state changed
    if (buzzNow !== lastBuzzState) {
      lastBuzzState = buzzNow;
      phraseIndex = 0;
      charIndex = 0;
      isDeleting = false;
    }

    var current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 90;

    if (!isDeleting && charIndex === current.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 300;
    }

    // Add a tiny random variance so it feels organic
    speed += Math.random() * 60 - 30;

    timeout = setTimeout(type, speed);
  }

  // Start after a short delay so the canvas loads first
  setTimeout(type, 600);

  // Cleanup not strictly needed but good practice
  el._typewriterCleanup = function () {
    clearTimeout(timeout);
  };
})();

/* ========================================================================
   Scroll Reveals — Intersection Observer
   ======================================================================== */

(function () {
  'use strict';

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();

/* ========================================================================
   3D Tilt — competency cards
   ======================================================================== */

(function () {
  'use strict';

  document.querySelectorAll('.card-3d-wrapper').forEach(function (wrapper) {
    const card = wrapper.querySelector('.card-3d');

    wrapper.addEventListener('mousemove', function (e) {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * -8;
      const ry = ((x - cx) / cx) * 8;
      card.style.transform =
        'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale3d(1.02, 1.02, 1.02)';
    });

    wrapper.addEventListener('mouseleave', function () {
      card.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    wrapper.addEventListener('mouseenter', function () {
      card.style.transition = 'transform 0.1s ease-out';
    });
  });
})();

/* ========================================================================
   Pipeline SVG line-draw on scroll
   ======================================================================== */

(function () {
  'use strict';

  const path = document.getElementById('pipeline-path');
  if (!path) return;

  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Animate the line drawing
          path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
          path.style.strokeDashoffset = '0';

          // Pulse the nodes sequentially
          const nodes = document.querySelectorAll('.pipeline__node');
          nodes.forEach(function (node, i) {
            setTimeout(function () {
              node.style.fill = '#2563eb';
              node.style.transition = 'fill 0.4s ease, r 0.4s ease';
              node.setAttribute('r', '10');
              setTimeout(function () {
                node.setAttribute('r', '8');
              }, 400);
            }, i * 360);
          });

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(path);
})();

/* ========================================================================
   Smooth scroll for scroll-hint click
   ======================================================================== */

(function () {
  'use strict';

  var hint = document.querySelector('.hero__scroll-hint');
  if (hint) {
    hint.addEventListener('click', function () {
      var cards = document.getElementById('expertise');
      if (cards) {
        cards.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
})();

/* ========================================================================
   Buzzword Mode Toggle
   ======================================================================== */

(function () {
  'use strict';

  var BUZZ_KEY = 'buzzword-mode';
  var buzzActive = localStorage.getItem(BUZZ_KEY) === 'true';

  // Buzzword typewriter phrases
  var realPhrases = ['I Orchestrate.', 'I Compose.', 'I Automate.', 'I Ship.'];
  var buzzPhrases = ['I Synergize.', 'I Disrupt.', 'I Innovate.', 'I Scale.'];

  // All elements with data-buzz — store originals before any swap
  var buzzEls = document.querySelectorAll('[data-buzz]');
  var originals = [];
  buzzEls.forEach(function (el) {
    originals.push(el.textContent.trim());
  });

  function getCurrentPhrases() {
    return buzzActive ? buzzPhrases : realPhrases;
  }

  // Hook into the typewriter: the typewriter reads `phrases` from its closure.
  // We expose a setter by patching the phrases array reference.
  // The typewriter IIFE captures `phrases` as a local — we need a bridge.
  // Instead, we re-read the phrase on each type cycle from a getter.
  // Simplest: store a reference the typewriter can poll.
  window.__buzzwordPhrases = buzzActive ? buzzPhrases : realPhrases;

  function applyBuzz() {
    var els = document.querySelectorAll('[data-buzz]');
    els.forEach(function (el, i) {
      if (buzzActive) {
        // Store current real text before swapping
        if (!el.hasAttribute('data-real')) {
          el.setAttribute('data-real', el.textContent.trim());
        }
        el.textContent = el.getAttribute('data-buzz');
      } else {
        el.textContent = el.getAttribute('data-real') || el.textContent;
      }
    });

    // Update typewriter phrases
    window.__buzzwordPhrases = buzzActive ? buzzPhrases : realPhrases;

    // Toggle body class for any CSS overrides
    if (buzzActive) {
      document.body.classList.add('buzzword-mode');
    } else {
      document.body.classList.remove('buzzword-mode');
    }

    // Update button
    var btn = document.getElementById('buzz-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', buzzActive ? 'true' : 'false');
      btn.classList.toggle('buzz--active', buzzActive);
    }

    localStorage.setItem(BUZZ_KEY, buzzActive ? 'true' : 'false');
  }

  // Apply on load if was active
  if (buzzActive) {
    applyBuzz();
  }

  // Toggle button
  var toggleBtn = document.getElementById('buzz-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      buzzActive = !buzzActive;
      applyBuzz();
    });
  }
})();

