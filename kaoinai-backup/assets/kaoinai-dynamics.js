/* ==========================================================================
   KaoinAI Dynamics Layer v1.1
   Site-wide interactivity: data-lineage particle canvas, scroll reveals,
   navbar state, scrollspy, 3D card tilt, magnetic buttons, parallax orbs,
   back-to-top. Defensive: every feature checks the DOM before acting and
   never touches content. Safe to load on every page.
   v1.1: slightly denser, more visible lineage network.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  /* ----------------------------------------------------------------------
     1. Data-lineage particle network — a living "lineage graph" backdrop.
        Nodes drift, edges draw between near neighbours, mouse acts as a
        gentle attractor. Paused when tab hidden.
     ---------------------------------------------------------------------- */
  function initLineageCanvas() {
    if (reduceMotion) return;
    var canvas = document.createElement('canvas');
    canvas.className = 'kd-lineage-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var W, H, nodes = [], raf = null, running = false;
    var mouse = { x: -9999, y: -9999 };
    var COLORS = ['168,85,247', '6,182,212', '124,58,237'];

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    }

    function seed() {
      var count = Math.max(30, Math.min(84, Math.floor(W * H / 22000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: 1 + Math.random() * 1.8,
          ph: Math.random() * Math.PI * 2,
          c: COLORS[i % COLORS.length]
        });
      }
    }

    function step(now) {
      var tt = (now || 0) / 1000;
      ctx.clearRect(0, 0, W, H);
      var LINK = 130;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        // soft mouse attraction
        var dx = mouse.x - n.x, dy = mouse.y - n.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < 32400 && d2 > 1) { // within 180px
          var f = 0.00018;
          n.vx += dx * f; n.vy += dy * f;
        }
        // clamp velocity
        var sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (sp > 0.55) { n.vx = n.vx / sp * 0.55; n.vy = n.vy / sp * 0.55; }
        if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;

        var tw = 0.75 + 0.35 * Math.sin(tt * 1.9 + n.ph);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * tw, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + n.c + ',' + (0.55 * tw + 0.2).toFixed(3) + ')';
        ctx.fill();
      }
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var p = nodes[a], q = nodes[b];
          var ddx = p.x - q.x, ddy = p.y - q.y;
          var dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < LINK) {
            var alpha = (1 - dist / LINK) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = 'rgba(148,120,220,' + alpha + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(step);
    }

    function start() { if (!running) { running = true; step(); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    resize();
    start();
  }

  /* ----------------------------------------------------------------------
     2. Scroll-driven navbar state + scrollspy for in-page anchors.
     ---------------------------------------------------------------------- */
  function initNav() {
    var nav = document.querySelector('.nav');
    if (nav) {
      var onScroll = function () {
        nav.classList.toggle('kd-scrolled', window.scrollY > 30);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    // Scrollspy: highlight nav links whose #target is in view
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.nav-links a[href^="#"], .mobile-overlay a[href^="#"]')
    );
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      if (!id || map[id]) return;
      var sec = document.getElementById(id);
      if (!sec) return;
      map[id] = [];
      links.forEach(function (b) { if (b.getAttribute('href') === '#' + id) map[id].push(b); });
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var list = map[en.target.id];
        if (!list) return;
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.remove('kd-active'); });
          list.forEach(function (a) { a.classList.add('kd-active'); });
        }
      });
    }, { rootMargin: '-38% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) {
      spy.observe(document.getElementById(id));
    });
  }

  /* ----------------------------------------------------------------------
     3. Scroll progress bar — create only if the page has no own handler.
     ---------------------------------------------------------------------- */
  function initProgress() {
    var bar = document.querySelector('.scroll-progress');
    var ownHandler = false;
    // If the page already wires #scrollProgress itself, leave it alone.
    if (bar && bar.id === 'scrollProgress') ownHandler = true;
    if (ownHandler) { bar.classList.add('kd-progress'); return; }

    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'kd-progress';
      bar.style.cssText = 'position:fixed;top:0;left:0;height:3px;width:0;z-index:10000;';
      document.body.appendChild(bar);
    }
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ----------------------------------------------------------------------
     4. Reveal-on-scroll for pages/sections without existing reveal markup.
        Auto-tags generic content blocks with .kd-in and observes them.
     ---------------------------------------------------------------------- */
  function initReveals() {
    if (!('IntersectionObserver' in window)) return;

    // Safety net: elements that have .reveal but no page-level observer
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible', 'kd-show');
          revealObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    document.querySelectorAll('.reveal:not(.visible)').forEach(function (el) {
      revealObs.observe(el);
    });

    // Generic auto-reveal for content blocks on quieter pages
    var GENERIC = 'section h2, .header-area, main > *:not(script):not(style), .calc-card, .result-card, .blog-card, article .post-body > *:is(p, h2, h3, ul, ol, blockquote, table, img), .vs-card, .audit-card, .dg-card';
    var targets = document.querySelectorAll(GENERIC);
    if (!targets.length) return;
    var seen = new Set();
    var groups = new Map();
    targets.forEach(function (el) {
      if (el.closest('.hero')) return;               // hero has own choreography
      if (el.classList.contains('reveal')) return;    // already handled
      if (el.classList.contains('kd-lineage-canvas')) return;
      if (seen.has(el)) return;
      if (window.getComputedStyle(el).display === 'none') return; // hidden widgets/modals
      seen.add(el);
      el.classList.add('kd-in');
      var parent = el.parentElement;
      if (!groups.has(parent)) groups.set(parent, 0);
      el.style.transitionDelay = Math.min(groups.get(parent) * 0.07, 0.42) + 's';
      groups.set(parent, groups.get(parent) + 1);
    });
    var kdObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('kd-show');
          kdObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
    document.querySelectorAll('.kd-in').forEach(function (el) { kdObs.observe(el); });
  }

  /* ----------------------------------------------------------------------
     5. 3D tilt on cards (fine pointers only) + magnetic buttons.
     ---------------------------------------------------------------------- */
  function initTilt() {
    if (!finePointer || reduceMotion) return;
    var CARDS = '.feature-card, .hero-pillar-card, .persona-card, .card, .calc-card, .usecase-card, .pricing-card';
    document.querySelectorAll(CARDS).forEach(function (card) {
      // cursor spotlight variables
      card.addEventListener('pointermove', function (e) {
        var rr = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rr.left).toFixed(0) + 'px');
        card.style.setProperty('--my', (e.clientY - rr.top).toFixed(0) + 'px');
      }, { passive: true });
      var raf = null;
      card.addEventListener('pointerenter', function () { card.classList.add('kd-tilting'); });
      card.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = 'translateY(-6px) perspective(900px) rotateX(' + (-py * 5).toFixed(2) + 'deg) rotateY(' + (px * 5).toFixed(2) + 'deg)';
          raf = null;
        });
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('kd-tilting');
        card.style.transform = '';
      });
    });

    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        if (btn.classList.contains('kd-mag-busy')) return;
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.12;
        var dy = (e.clientY - r.top - r.height / 2) * 0.22;
        btn.style.translate = dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px';
      });
      btn.addEventListener('pointerleave', function () { btn.style.translate = ''; });
    });
  }

  /* ----------------------------------------------------------------------
     6. Parallax hero orbs & blobs following the pointer.
     ---------------------------------------------------------------------- */
  function initParallax() {
    if (!finePointer || reduceMotion) return;
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var layers = hero.querySelectorAll('.hero-orb, .mesh-blob, .hero-glow');
    if (!layers.length) return;
    var raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    function apply() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      layers.forEach(function (el, i) {
        var depth = (i + 1) * 7;
        el.style.translate = (cx * depth).toFixed(1) + 'px ' + (cy * depth).toFixed(1) + 'px';
      });
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(apply);
      else raf = null;
    }
  }

  /* ----------------------------------------------------------------------
     7. Back-to-top button.
     ---------------------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.createElement('button');
    btn.className = 'kd-top';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '&#8593;';
    document.body.appendChild(btn);
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        btn.classList.toggle('kd-on', window.scrollY > 600);
        ticking = false;
      });
    }, { passive: true });
  }

  /* ----------------------------------------------------------------------
     8. Button click ripple (material-style, kimi.com micro-interaction).
     ---------------------------------------------------------------------- */
  function initRipple() {
    if (reduceMotion) return;
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.btn') : null;
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      var s = document.createElement('span');
      s.className = 'kd-ripple';
      s.style.left = (e.clientX - r.left) + 'px';
      s.style.top = (e.clientY - r.top) + 'px';
      btn.appendChild(s);
      setTimeout(function () { s.remove(); }, 700);
    });
  }

  /* ----------------------------------------------------------------------
     9. Subtle idle float for decorative orbs (pages without parallax).
     ---------------------------------------------------------------------- */
  function initIdleFloat() {
    if (reduceMotion || finePointer) return;
    document.querySelectorAll('.hero-orb').forEach(function (orb, i) {
      orb.style.animation = 'kd-orb-float ' + (7 + i * 1.7) + 's ease-in-out ' + (i * 0.9) + 's infinite';
    });
    var style = document.createElement('style');
    style.textContent = '@keyframes kd-orb-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-16px)}}';
    document.head.appendChild(style);
  }

  /* ---------- boot ---------- */
  ready(function () {
    try { initLineageCanvas(); } catch (e) {}
    try { initNav(); } catch (e) {}
    try { initProgress(); } catch (e) {}
    try { initReveals(); } catch (e) {}
    try { initTilt(); } catch (e) {}
    try { initParallax(); } catch (e) {}
    try { initBackToTop(); } catch (e) {}
    try { initRipple(); } catch (e) {}
    try { initIdleFloat(); } catch (e) {}
  });
})();
