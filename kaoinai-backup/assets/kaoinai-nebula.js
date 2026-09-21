/* ==========================================================================
   KaoinAI Nebula Background v1.1
   A self-hosted WebGL aurora — the same style of animated background used
   on the current Kimi / Moonshot websites (Unicorn-Studio-style flowing
   nebula), rebuilt as a tiny dependency-free fragment shader in the
   KaoinAI violet/cyan palette.

   - Domain-warped fractal noise, two drifting aurora bands + silk filaments
   - Smoothed pointer parallax, gentle film grain, vignette
   - Pauses when the tab is hidden; skipped entirely for reduced motion or
     when WebGL is unavailable (the CSS aurora then stays as fallback)
   v1.1: brighter, broader bands and a higher scroll-dim floor so the
   ambience stays alive on every page, not just the hero.
   ========================================================================== */
(function () {
  'use strict';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.querySelector('.kd-nebula')) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'kd-nebula';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;inset:0;z-index:-2;pointer-events:none;width:100%;height:100%;';

  var gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power' })
        || canvas.getContext('experimental-webgl');
  if (!gl) return; // CSS aurora fallback stays

  var VERT = [
    'attribute vec2 p;',
    'void main(){ gl_Position = vec4(p, 0.0, 1.0); }'
  ].join('\n');

  var FRAG = [
    'precision mediump float;',
    'uniform vec2 u_res;',
    'uniform float u_time;',
    'uniform vec2 u_mouse;',
    'uniform float u_scroll;',
    '',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',
    '',
    'float noise(vec2 p){',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(',
    '    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),',
    '    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),',
    '    u.y);',
    '}',
    '',
    'const mat2 ROT = mat2(0.8, 0.6, -0.6, 0.8);',
    '',
    'float fbm(vec2 p){',
    '  float v = 0.0;',
    '  float a = 0.55;',
    '  for (int i = 0; i < 5; i++){',
    '    v += a * noise(p);',
    '    p = ROT * p * 2.03;',
    '    a *= 0.5;',
    '  }',
    '  return v;',
    '}',
    '',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy * 2.0 - u_res) / min(u_res.x, u_res.y);',
    '  uv += u_mouse * 0.08;',
    '  float t = u_time * 0.045;',
    '',
    '  // double domain warp -> flowing silk',
    '  vec2 q = vec2(',
    '    fbm(uv * 1.35 + vec2(0.0, t)),',
    '    fbm(uv * 1.35 + vec2(5.2, -t * 0.72)));',
    '  vec2 r = vec2(',
    '    fbm(uv * 1.35 + q * 1.55 + vec2(1.7, 9.2) + t * 0.32),',
    '    fbm(uv * 1.35 + q * 1.55 + vec2(8.3, 2.8) - t * 0.21));',
    '  float f = fbm(uv * 1.35 + r * 1.7);',
    '',
    '  vec3 base   = vec3(0.022, 0.016, 0.048);',
    '  vec3 violet = vec3(0.435, 0.196, 0.870);',
    '  vec3 indigo = vec3(0.250, 0.140, 0.720);',
    '  vec3 cyan   = vec3(0.060, 0.680, 0.830);',
    '  vec3 magenta= vec3(0.640, 0.260, 0.780);',
    '',
    '  vec3 col = base;',
    '',
    '  // broad ambient wash so the whole viewport lives, not just band cores',
    '  col += violet * 0.085 * (0.6 + 0.4 * sin(t * 0.9 + uv.x * 1.4));',
    '  col += indigo * 0.06 * smoothstep(1.4, 0.1, length(uv * vec2(0.8, 1.15) - vec2(0.15, -0.1)));',
    '',
    '  // primary violet aurora band',
    '  float band1 = smoothstep(0.30, 0.88, f + 0.18 * sin(t * 1.6 + q.x * 6.2831));',
    '  col += violet * band1 * 0.52;',
    '  col += indigo * smoothstep(0.50, 1.00, f) * 0.42;',
    '',
    '  // counter-drifting cyan band',
    '  float band2 = smoothstep(0.44, 0.94, fbm(uv * 1.9 - r * 0.8 + vec2(t * 0.55, -t * 0.35)));',
    '  col += cyan * band2 * 0.34;',
    '',
    '  // silk filaments + magenta sheen',
    '  col += magenta * pow(max(f - 0.22, 0.0), 2.2) * 1.10;',
    '  col += violet * pow(max(q.y - 0.18, 0.0), 2.0) * 0.50;',
    '',
    '  // gentle vertical light falloff (brighter near top like the Kimi page)',
    '  col *= 0.78 + 0.45 * smoothstep(-1.2, 1.0, uv.y);',
    '',
    '  // scroll-linked dimming: the nebula breathes at the hero and settles',
    '  // into a quiet ambience as content scrolls in (kimi.com signature)',
    '  col *= mix(1.0, 0.55, clamp(u_scroll, 0.0, 1.0));',
    '',
    '  // vignette',
    '  col *= 1.0 - 0.5 * dot(uv * 0.62, uv * 0.62);',
    '',
    '  // fine grain to avoid banding',
    '  col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.014;',
    '',
    '  gl_FragColor = vec4(max(col, 0.0), 1.0);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null;
    return s;
  }

  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, 'u_res');
  var uTime = gl.getUniformLocation(prog, 'u_time');
  var uMouse = gl.getUniformLocation(prog, 'u_mouse');
  var uScroll = gl.getUniformLocation(prog, 'u_scroll');

  var scrollTarget = 0, scrollCur = 0;
  function readScroll() {
    scrollTarget = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight * 0.9)));
  }
  window.addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  var W, H;
  function targetSize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5) * 0.8; // perf headroom
    return [
      Math.max(1, Math.floor(window.innerWidth * dpr)),
      Math.max(1, Math.floor(window.innerHeight * dpr))
    ];
  }
  function resize() {
    var s = targetSize();
    W = s[0]; H = s[1];
    canvas.width = W; canvas.height = H;
    gl.viewport(0, 0, W, H);
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('pointermove', function (e) {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });

  document.body.appendChild(canvas);

  var raf = null, running = false, start = performance.now();
  function frame(now) {
    // self-heal: recover if the canvas was sized while the panel was hidden
    var s = targetSize();
    if (s[0] !== W || s[1] !== H) resize();
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    scrollCur += (scrollTarget - scrollCur) * 0.06;
    gl.uniform2f(uRes, W, H);
    gl.uniform1f(uTime, (now - start) / 1000);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform1f(uScroll, scrollCur);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = null; }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  start();
})();
