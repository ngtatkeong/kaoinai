import sys

path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    data = f.read()

# 1. Update intro to use namecard logo (clean Kappa), 4s duration, add skip button
old_intro = '''  <!-- Site Intro -->
  <div class="site-intro" id="siteIntro">
    <img src="logo.png" class="site-intro-logo" alt="KaoinAI">
    <p class="site-intro-tagline">Intelligence for All</p>
    <div class="site-intro-line"></div>
  </div>'''

new_intro = '''  <!-- Site Intro -->
  <div class="site-intro" id="siteIntro">
    <img src="logo-namecard.png" class="site-intro-logo" alt="KaoinAI">
    <p class="site-intro-tagline">Intelligence for All</p>
    <div class="site-intro-line"></div>
    <button class="site-intro-skip" id="introSkip">Skip Intro</button>
  </div>'''

data = data.replace(old_intro, new_intro)

# 2. Update CSS: 4s duration, add skip button styles
old_css = '''    @keyframes introFade {
      from { opacity: 1; visibility: visible; }
      to { opacity: 0; visibility: hidden; }
    }'''

new_css = '''    @keyframes introFade {
      from { opacity: 1; visibility: visible; }
      to { opacity: 0; visibility: hidden; }
    }
    .site-intro-skip {
      position: absolute;
      bottom: 60px;
      padding: 8px 24px;
      border-radius: 99px;
      background: transparent;
      border: 1px solid rgba(168,85,247,0.3);
      color: var(--text-secondary);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.3s ease;
      opacity: 0;
      animation: introFadeIn 0.5s ease 1.5s forwards;
      pointer-events: auto;
    }
    .site-intro-skip:hover {
      border-color: var(--accent);
      color: var(--text);
      background: rgba(168,85,247,0.1);
    }'''

data = data.replace(old_css, new_css)

# 3. Update animation delay from 2.8s to 4s
# The introFade animation delay is in the .site-intro rule
old_delay = 'animation: introFade 1s cubic-bezier(0.16, 1, 0.3, 1) 2.8s forwards;'
new_delay = 'animation: introFade 1s cubic-bezier(0.16, 1, 0.3, 1) 4s forwards;'
data = data.replace(old_delay, new_delay)

# 4. Update JS: increase cleanup timeout and add skip handler
old_js = '''    // Remove intro overlay from DOM after animation
    setTimeout(() => {
      const intro = document.getElementById('siteIntro');
      if (intro) intro.remove();
    }, 4500);'''

new_js = '''    // Remove intro overlay from DOM after animation
    setTimeout(() => {
      const intro = document.getElementById('siteIntro');
      if (intro) intro.remove();
    }, 6000);

    // Skip intro button
    const skipBtn = document.getElementById('introSkip');
    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        const intro = document.getElementById('siteIntro');
        if (intro) {
          intro.style.animation = 'none';
          intro.style.opacity = '0';
          intro.style.visibility = 'hidden';
          setTimeout(() => intro.remove(), 300);
        }
      });
    }'''

data = data.replace(old_js, new_js)

with open(path, 'w', encoding='utf-8') as f:
    f.write(data)

print('Done! Updated intro:')
print('  - Uses logo-namecard.png (clean Kappa, no dots)')
print('  - Duration: 4 seconds')
print('  - Skip Intro button added')
print('  - Skip button fades in at 1.5s')
