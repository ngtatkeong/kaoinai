import sys

path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    data = f.read()

# Edit 1: Insert hero-bg-img after hero-glow-2
old1 = '    <div class="hero-glow hero-glow-2"></div>\n\n    <div class="hero-content">'
new1 = '    <div class="hero-glow hero-glow-2"></div>\n    <img src="images/hero-bg.png" class="hero-bg-img" alt="">\n\n    <div class="hero-content">'
data = data.replace(old1, new1)

# Edit 2: Add governance shield in story-visual
old2 = '        <div class="story-visual reveal">\n          <div class="mock-browser"'
new2 = '        <div class="story-visual reveal">\n          <img src="images/governance-shield.png" style="width:100%; border-radius:16px; box-shadow:0 20px 80px rgba(0,0,0,0.5); margin-bottom:20px;" alt="">\n          <div class="mock-browser"'
data = data.replace(old2, new2)

# Edit 3: Add neural brain in CTA section
old3 = '  <section class="section cta-section" id="cta">\n    <h2 class="reveal">Ready to see your data'
new3 = '  <section class="section cta-section" id="cta">\n    <img src="images/neural-brain.png" style="position:absolute; right:-5%; top:50%; transform:translateY(-50%); width:300px; opacity:0.25; pointer-events:none; z-index:0;" alt="">\n    <h2 class="reveal">Ready to see your data'
data = data.replace(old3, new3)

with open(path, 'w', encoding='utf-8') as f:
    f.write(data)

print('Done! 3 edits applied.')
