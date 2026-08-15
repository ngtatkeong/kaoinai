import re

with open(r'D:\kaoinai-website\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# The text we want to replace
old_text = """      </div>
    </div>
  </section>

  <!-- Value Prop: The Problem -->
  <section class="section">
    <div class="section-inner">
      <p class="overline reveal">The Challenge</p>"""

new_text = """      </div>
    </div>
  </section>

  <!-- Intro: Who We Are -->
  <section class="intro-section" id="intro">
    <div class="section-inner" style="position: relative; z-index: 1;">
      <div class="intro-logo reveal">
        <img src="logo.png" alt="KaoinAI">
      </div>
      <h2 class="intro-tagline reveal">
        We believe every business deserves<br><span>enterprise-grade data tools.</span>
      </h2>
      <p class="intro-story reveal reveal-delay-1">
        KaoinAI was built on a simple idea: small and medium businesses generate just as much 
        valuable data as large enterprises — but they rarely have the budget or expertise to 
        manage it. We combine artificial intelligence with proven data governance practices 
        to give SMEs the same power the big players have, at a fraction of the cost. No 
        expensive consultants. No coding required. Just smarter data, for everyone.
      </p>
      <div class="intro-pillars reveal reveal-delay-2">
        <div class="intro-pillar">
          <div class="intro-pillar-num">SMEs</div>
          <div class="intro-pillar-label">Built For You</div>
        </div>
        <div class="intro-pillar">
          <div class="intro-pillar-num">AI + DG</div>
          <div class="intro-pillar-label">Intelligence Meets Governance</div>
        </div>
        <div class="intro-pillar">
          <div class="intro-pillar-num">1/10</div>
          <div class="intro-pillar-label">The Cost of Enterprise Tools</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Value Prop: The Problem -->
  <section class="section">
    <div class="section-inner">
      <p class="overline reveal">The Challenge</p>"""

if old_text in content:
    content = content.replace(old_text, new_text, 1)
    with open(r'D:\kaoinai-website\index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Inserted intro section successfully')
else:
    print('old_text not found')
    # Debug: find the closest match
    idx = content.find('<!-- Value Prop: The Problem -->')
    if idx >= 0:
        print('Found The Problem comment at index', idx)
        print('Context:', repr(content[idx-100:idx+200]))
    else:
        print('Could not find The Problem comment')
