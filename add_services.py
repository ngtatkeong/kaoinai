import sys

path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    data = f.read()

services_html = '''  <!-- Services -->
  <section class="section" id="services">
    <div class="section-inner">
      <div style="text-align: center; margin-bottom: 64px;">
        <p class="overline reveal">Consulting</p>
        <h2 class="headline-lg reveal">Expertise. On demand.</h2>
        <p class="subhead reveal" style="margin: 16px auto 0;">
          Years of enterprise data governance experience, now available to SMEs.
        </p>
      </div>
      <div class="features-grid">
        <div class="feature-card reveal">
          <div class="feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>DG / DQ Consultancy</h3>
          <p>End-to-end data governance and data quality advisory for organisations building their data foundation from scratch or scaling existing programs. We help you design governance frameworks, define data quality standards, implement PII detection strategies, and establish MDM practices — all tailored to your industry and regulatory environment. Whether you need a DAMA-aligned roadmap or a pragmatic start-up approach, we bring hands-on experience from running enterprise-grade DG programs.</p>
        </div>
        <div class="feature-card reveal reveal-delay-1">
          <div class="feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3>CTO as a Service</h3>
          <p>Fractional CTO support for SMEs that need senior data and AI leadership without the full-time overhead. We advise on data architecture, AI strategy, vendor selection, and team build-out. From evaluating whether you need a data warehouse or a lakehouse, to defining your first AI use case, to hiring your initial data team — we act as your technical co-founder for data. Ideal for companies raising funding or scaling past their first data hire.</p>
        </div>
        <div class="feature-card reveal reveal-delay-2">
          <div class="feature-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <h3>Professional Services</h3>
          <p>Hands-on implementation, integration, and training to get your data platform live and your team productive. We handle database connector setup, catalog ingestion, lineage mapping, quality rule configuration, and custom dbt model development. Includes knowledge transfer sessions so your team can self-manage the platform post-deployment. We also deliver executive briefings and board-level data strategy presentations.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->'''

data = data.replace('  <!-- Features -->', services_html)

with open(path, 'w', encoding='utf-8') as f:
    f.write(data)

print('Done! Services section added with 3 cards:')
print('  1. DG / DQ Consultancy')
print('  2. CTO as a Service')
print('  3. Professional Services')
