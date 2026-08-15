import sys

path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    data = f.read()

# 1. Add intro CSS before closing </style>
intro_css = '''
    /* ===== SITE INTRO ===== */
    .site-intro {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: var(--bg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: introFade 1s cubic-bezier(0.16, 1, 0.3, 1) 2.8s forwards;
      pointer-events: none;
    }
    .site-intro-logo {
      height: 180px;
      width: auto;
      animation: introScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
    }
    .site-intro-tagline {
      margin-top: 24px;
      font-size: 18px;
      font-weight: 500;
      color: var(--accent);
      letter-spacing: 0.05em;
      opacity: 0;
      animation: introFadeIn 0.6s ease 1s forwards;
    }
    .site-intro-line {
      width: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--accent), var(--accent-2), transparent);
      margin-top: 32px;
      animation: introLineGrow 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1.4s forwards;
    }
    @keyframes introFade {
      from { opacity: 1; visibility: visible; }
      to { opacity: 0; visibility: hidden; }
    }
    @keyframes introScale {
      from { transform: scale(0.6); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes introFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes introLineGrow {
      from { width: 0; }
      to { width: 200px; }
    }
'''

data = data.replace('  </style>', intro_css + '  </style>')

# 2. Insert intro overlay right after <body>
intro_html = '''<body>

  <!-- Site Intro -->
  <div class="site-intro" id="siteIntro">
    <img src="logo.png" class="site-intro-logo" alt="KaoinAI">
    <p class="site-intro-tagline">Intelligence for All</p>
    <div class="site-intro-line"></div>
  </div>
'''

data = data.replace('<body>', intro_html)

# 3. Make nav logo even bigger
data = data.replace('.nav-logo img { height: 48px; width: auto; }',
                    '.nav-logo img { height: 52px; width: auto; }')

# 4. Add intro cleanup JS - remove intro from DOM after animation completes
old_script_end = '''    document.querySelectorAll('a[href^="#"]').forEach(anchor => {'''
new_script_end = '''    // Remove intro overlay from DOM after animation
    setTimeout(() => {
      const intro = document.getElementById('siteIntro');
      if (intro) intro.remove();
    }, 4500);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {'''

data = data.replace(old_script_end, new_script_end)

with open(path, 'w', encoding='utf-8') as f:
    f.write(data)

print('Done! Added:')
print('  - Full-screen intro with large logo (180px)')
print('  - "Intelligence for All" tagline with glow line')
print('  - Logo scales in, then intro fades after 2.8s')
print('  - Nav logo bumped to 52px')
print('  - Intro overlay removed from DOM after animation')
