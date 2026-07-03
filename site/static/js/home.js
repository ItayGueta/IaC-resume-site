/* ========================================================================
   Typewriter — hero headline
   ======================================================================== */

(function () {
  'use strict';

  var el = document.getElementById('hero-typewriter');
  if (!el) return;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var defaultPhrases = [
    'Orchestration.',
    'Cost Optimization.',
    'Development.',
    'Design.',
    'Automation.',
    'Bar Mitzvahs.',
  ];

  if (prefersReduced) {
    el.textContent = defaultPhrases[0];
    return;
  }

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

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  document.querySelectorAll('.card-3d-wrapper').forEach(function (wrapper) {
    var card = wrapper.querySelector('.card-3d');

    wrapper.addEventListener('mouseenter', function () {
      card.style.transition = 'transform 0.1s ease-out';
      card.style.willChange = 'transform';
    });

    wrapper.addEventListener('mousemove', function (e) {
      var rect = wrapper.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rx = ((y - cy) / cy) * -8;
      var ry = ((x - cx) / cx) * 8;
      card.style.transform =
        'perspective(800px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale3d(1.02, 1.02, 1.02)';
    });

    wrapper.addEventListener('mouseleave', function () {
      card.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    });

    card.addEventListener('transitionend', function () {
      card.style.willChange = 'auto';
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
          // Reset before each entry so it re-draws
          path.style.transition = 'none';
          path.style.strokeDashoffset = length;
          // Force layout so reset applies before the animate frame
          path.getBoundingClientRect();

          path.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
          path.style.strokeDashoffset = '0';

          // Reset + pulse the nodes sequentially
          const nodes = document.querySelectorAll('.pipeline__node');
          nodes.forEach(function (node) {
            node.style.fill = '#edf1ee';
          });
          nodes.forEach(function (node, i) {
            setTimeout(function () {
              node.style.fill = '#2556d8';
              node.style.transition = 'fill 0.4s ease, r 0.4s ease';
              node.setAttribute('r', '10');
              setTimeout(function () {
                node.setAttribute('r', '8');
              }, 400);
            }, i * 360);
          });
        } else {
          // Reset when leaving viewport so it can re-draw on return
          path.style.transition = 'none';
          path.style.strokeDashoffset = length;
          document.querySelectorAll('.pipeline__node').forEach(function (node) {
            node.style.fill = '#edf1ee';
          });
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
  var realPhrases = ['Orchestration.', 'Cost Optimization.', 'Development.', 'Design.', 'Automation.', 'Engineering.'];
  var buzzPhrases = ['Synergy.', 'Right-Sizing.', 'Digital Transformation.', 'Ideation.', 'Disruption.', 'Bar Mitzvahs.'];

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

