import sys

path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    data = f.read()

# 1. Add new CSS animations before the closing </style>
animations_css = '''
    /* ===== ANIMATIONS ===== */
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(2deg); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blink {
      0%, 100% { border-color: transparent; }
      50% { border-color: var(--accent); }
    }
    @keyframes orbit {
      0% { transform: rotate(0deg) translateX(80px) rotate(0deg); }
      100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); }
    }
    @keyframes pulseRing {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes meshMove {
      0% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.95); }
      100% { transform: translate(0, 0) scale(1); }
    }

    /* Hero typing headline */
    .hero-typing {
      overflow: hidden;
      white-space: nowrap;
      border-right: 2px solid var(--accent);
      animation: typing 2.5s steps(30, end) forwards, blink 0.8s step-end infinite;
      display: inline-block;
      max-width: fit-content;
    }

    /* Floating elements */
    .float { animation: float 4s ease-in-out infinite; }
    .float-delay-1 { animation: float 5s ease-in-out infinite 0.5s; }
    .float-delay-2 { animation: float 6s ease-in-out infinite 1s; }

    /* Animated gradient border on feature cards */
    .feature-card::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 17px;
      padding: 1px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2), var(--accent));
      background-size: 300% 300%;
      animation: gradientShift 4s ease infinite;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: 0;
      transition: opacity 0.4s;
      pointer-events: none;
      z-index: -1;
    }
    .feature-card:hover::after { opacity: 1; }

    /* Shimmer effect on buttons */
    .btn-primary {
      position: relative;
      overflow: hidden;
    }
    .btn-primary::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      background-size: 200% 100%;
      animation: shimmer 3s ease-in-out infinite;
      pointer-events: none;
    }

    /* Mesh gradient background for CTA */
    .cta-section {
      background: 
        radial-gradient(ellipse at 20% 30%, rgba(168,85,247,0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(236,72,153,0.06) 0%, transparent 50%),
        var(--bg);
    }

    /* Animated orbs in hero */
    .hero-orb {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
    }
    .hero-orb-1 {
      width: 8px; height: 8px;
      background: var(--accent);
      box-shadow: 0 0 20px var(--accent), 0 0 40px var(--accent-glow);
      animation: orbit 20s linear infinite, pulse 2s ease-in-out infinite;
    }
    .hero-orb-2 {
      width: 6px; height: 6px;
      background: var(--accent-2);
      box-shadow: 0 0 15px var(--accent-2), 0 0 30px rgba(236,72,153,0.3);
      animation: orbit 25s linear infinite reverse, pulse 2.5s ease-in-out infinite;
    }
    .hero-orb-3 {
      width: 10px; height: 10px;
      background: var(--success);
      box-shadow: 0 0 25px var(--success), 0 0 50px rgba(34,197,94,0.3);
      animation: orbit 30s linear infinite, pulse 3s ease-in-out infinite;
    }

    /* Parallax mesh overlay */
    .mesh-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      opacity: 0.4;
    }
    .mesh-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      animation: meshMove 15s ease-in-out infinite;
    }
    .mesh-blob-1 { width: 400px; height: 400px; background: rgba(168,85,247,0.12); top: 10%; left: 20%; animation-delay: 0s; }
    .mesh-blob-2 { width: 300px; height: 300px; background: rgba(236,72,153,0.1); top: 60%; right: 10%; animation-delay: -5s; }
    .mesh-blob-3 { width: 250px; height: 250px; background: rgba(59,130,246,0.08); bottom: 20%; left: 50%; animation-delay: -10s; }

    /* Scroll progress bar */
    .scroll-progress {
      position: fixed;
      top: 0; left: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      z-index: 10000;
      width: 0%;
      transition: width 0.1s linear;
    }

    /* Enhanced reveal animations */
    .reveal-up {
      opacity: 0;
      transform: translateY(60px);
      transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-up.visible { opacity: 1; transform: translateY(0); }

    .reveal-scale {
      opacity: 0;
      transform: scale(0.9);
      transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-scale.visible { opacity: 1; transform: scale(1); }

    /* Magnetic hover effect on nav links */
    .nav-links a {
      position: relative;
      transition: color 0.3s, transform 0.2s ease;
    }
    .nav-links a::after {
      content: '';
      position: absolute;
      bottom: -4px; left: 50%;
      width: 0; height: 2px;
      background: linear-gradient(90deg, var(--accent), var(--accent-2));
      transition: width 0.3s ease, left 0.3s ease;
    }
    .nav-links a:hover::after { width: 100%; left: 0; }
    .nav-links a:hover { transform: translateY(-1px); }

    /* Showcase image hover zoom */
    .showcase-item .mock-browser {
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
    }
    .showcase-item:hover .mock-browser {
      transform: scale(1.02) translateY(-4px);
      box-shadow: 0 0 0 1px rgba(168,85,247,0.15), 0 30px 100px rgba(0,0,0,0.6);
    }

    /* Pricing card glow pulse */
    .pricing-card {
      transition: transform 0.4s ease, box-shadow 0.4s ease;
    }
    .pricing-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 0 60px rgba(168,85,247,0.15), 0 20px 80px rgba(0,0,0,0.5);
    }

    /* Stats counter animation placeholder */
    .story-stat-num {
      transition: transform 0.3s ease;
    }
    .story-stat-num:hover {
      transform: scale(1.1);
    }
'''

# Insert before closing </style>
data = data.replace('  </style>', animations_css + '  </style>')

# 2. Add scroll progress bar after <body>
data = data.replace('<body>', '<body>\n  <div class="scroll-progress" id="scrollProgress"></div>')

# 3. Add animated orbs and mesh to hero section
old_hero = '''  <section class="hero">
    <div class="hero-grid"></div>
    <div class="hero-glow hero-glow-1"></div>
    <div class="hero-glow hero-glow-2"></div>
    <img src="images/hero-bg.png" class="hero-bg-img" alt="">'''
new_hero = '''  <section class="hero">
    <div class="hero-grid"></div>
    <div class="hero-glow hero-glow-1"></div>
    <div class="hero-glow hero-glow-2"></div>
    <img src="images/hero-bg.png" class="hero-bg-img" alt="">
    <div class="mesh-overlay">
      <div class="mesh-blob mesh-blob-1"></div>
      <div class="mesh-blob mesh-blob-2"></div>
      <div class="mesh-blob mesh-blob-3"></div>
    </div>
    <div class="hero-orb hero-orb-1" style="top:30%; left:45%;"></div>
    <div class="hero-orb hero-orb-2" style="top:50%; left:55%;"></div>
    <div class="hero-orb hero-orb-3" style="top:40%; left:40%;"></div>'''
data = data.replace(old_hero, new_hero)

# 4. Update hero headline to use typing animation - change the h1
old_h1 = '''      <h1 class="headline-xl reveal">
        The Data Platform<br>
        <span>Built by AI, For You.</span>
      </h1>'''
new_h1 = '''      <h1 class="headline-xl reveal" style="min-height: 1.2em;">
        The Data Platform<br>
        <span class="hero-typing">Built by AI, For You.</span>
      </h1>'''
data = data.replace(old_h1, new_h1)

# 5. Update the JS section - add scroll progress and enhanced observer
data = data.replace('    const observer = new IntersectionObserver((entries) => {', '''    // Scroll progress bar
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      document.getElementById('scrollProgress').style.width = progress + '%';
    });

    // Enhanced intersection observer with stagger
    const observer = new IntersectionObserver((entries) => {''')

# 6. Add stagger delay to reveal elements within same parent
data = data.replace('    document.querySelectorAll(\'.reveal\').forEach(el => observer.observe(el));', '''    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Stagger animation for grids
    document.querySelectorAll('.features-grid, .story-grid, .showcase-item').forEach(grid => {
      const children = grid.querySelectorAll('.reveal, .reveal-up');
      children.forEach((child, i) => {
        child.style.transitionDelay = (i * 0.08) + 's';
      });
    });''')

with open(path, 'w', encoding='utf-8') as f:
    f.write(data)

print('Done! Modern animations added:')
print('  - Scroll progress bar')
print('  - Typing animation on hero headline')
print('  - Floating orbs in hero')
print('  - Animated mesh gradient blobs')
print('  - Shimmer effect on primary buttons')
print('  - Animated gradient borders on feature cards')
print('  - Showcase hover zoom effect')
print('  - Pricing card glow on hover')
print('  - Nav link underline animation')
print('  - Staggered reveal delays for grids')
