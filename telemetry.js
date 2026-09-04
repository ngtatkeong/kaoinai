/**
 * KaoinAI Visitor Telemetry, Feedback & Free Trial Conversion Engine
 * Automatically captures visitor user journeys, interactions, and inquiries,
 * routing all free trial requests and direct inquiries to tk.ng@kaoinai.com.
 */
(function() {
  const SESSION_KEY = 'kaoinai_telemetry_v1';
  const PRIMARY_CONTACT_EMAIL = 'tk.ng@kaoinai.com';
  
  // 1. Session Storage & Activity Tracker
  function getSessionData() {
    try {
      const data = sessionStorage.getItem(SESSION_KEY);
      if (data) return JSON.parse(data);
    } catch(e) {}
    return {
      sessionId: 'sess_' + Math.random().toString(36).substring(2, 9),
      startTime: Date.now(),
      referrer: document.referrer || 'Direct / Bookmark',
      pages: [],
      actions: [],
      device: {
        screen: window.screen.width + 'x' + window.screen.height,
        language: navigator.language || navigator.userLanguage || 'en',
        platform: navigator.platform || 'Unknown'
      }
    };
  }

  function saveSessionData(data) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch(e) {}
  }

  const session = getSessionData();
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (!session.pages.includes(currentPage)) {
    session.pages.push(currentPage);
  }

  // Public telemetry API
  window.kaoinaiLogAction = function(actionType, detail) {
    const elapsedSec = Math.round((Date.now() - session.startTime) / 1000);
    const entry = {
      type: actionType,
      detail: detail || '',
      page: currentPage,
      time: new Date().toLocaleTimeString(),
      elapsed: elapsedSec + 's'
    };
    session.actions.push(entry);
    if (session.actions.length > 60) session.actions.shift();
    saveSessionData(session);
  };

  // Initial page view event
  window.kaoinaiLogAction('Page Visit', document.title || currentPage);

  // Auto-track user interactions across the site
  document.addEventListener('click', function(e) {
    const target = e.target.closest('a, button, .usecase-card, .service-card-enhanced, .feature-card, .faq-question, .filter-btn');
    if (!target) return;
    if (target.closest('#kaoinaiFeedbackWidget') || target.id === 'feedbackTriggerBtn') return;

    let desc = target.innerText ? target.innerText.trim().substring(0, 50).replace(/\n/g, ' ') : '';
    
    if (target.classList.contains('usecase-card')) {
      const h3 = target.querySelector('h3');
      desc = 'Explored Use Case: ' + (h3 ? h3.innerText : 'Card');
    } else if (target.classList.contains('service-btn') || target.classList.contains('service-card-enhanced')) {
      const h3 = target.querySelector('h3');
      desc = 'Clicked Service: ' + (h3 ? h3.innerText : desc);
    } else if (target.classList.contains('faq-question')) {
      desc = 'Opened FAQ: ' + desc;
    } else if (target.hasAttribute('data-lang')) {
      desc = 'Changed Language to ' + target.getAttribute('data-lang');
    } else if (target.tagName === 'A' && target.getAttribute('href')) {
      desc = 'Link Click: ' + target.getAttribute('href') + ' (' + desc + ')';
    }

    if (desc) {
      window.kaoinaiLogAction('Interaction', desc);
    }
  }, true);

  // Helper to format full session summary for email payload
  window.kaoinaiGetActivitySummary = function() {
    const elapsedMin = (Math.round((Date.now() - session.startTime) / 60000 * 10) / 10) || 0.1;
    let text = `\n========================================\n`;
    text += `📊 VISITOR SESSION TELEMETRY REPORT\n`;
    text += `========================================\n`;
    text += `• Total Time on Site: ~${elapsedMin} minute(s)\n`;
    text += `• Pages Explored: ${session.pages.join(' -> ')}\n`;
    text += `• Acquisition Source / Referrer: ${session.referrer}\n`;
    text += `• Device & Resolution: ${session.device.screen} (${session.device.platform}, ${session.device.language})\n`;
    text += `• Timestamp: ${new Date().toLocaleString()}\n\n`;
    text += `📜 User Activity Stream (${session.actions.length} events recorded):\n`;
    session.actions.forEach((act, idx) => {
      text += `  ${idx + 1}. [T+${act.elapsed}] ${act.type} -> ${act.detail} (${act.page})\n`;
    });
    text += `========================================\n`;
    return text;
  };

  // Automatically append activity report to all standard forms on the site
  function autoBindForms() {
    document.querySelectorAll('form').forEach(form => {
      if (form.id === 'feedbackFormElement') return;
      form.addEventListener('submit', function() {
        let field = form.querySelector('input[name="user_activity_log"]');
        if (!field) {
          field = document.createElement('input');
          field.type = 'hidden';
          field.name = 'user_activity_log';
          form.appendChild(field);
        }
        field.value = window.kaoinaiGetActivitySummary();
        window.kaoinaiLogAction('Form Submitted', form.id || form.action);
      });
    });
  }

  // 2. Inject CSS Styles for Floating Feedback & Free Trial Engine
  function injectStyles() {
    const css = `
      #kaoinaiFloatingCluster {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99990;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .kf-cluster-btn {
        color: #ffffff;
        border: none;
        border-radius: 999px;
        padding: 9px 16px;
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        text-decoration: none;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      }
      .kf-cluster-btn:hover {
        transform: translateY(-2px);
      }
      #kfBtnTrial {
        background: linear-gradient(135deg, #a855f7, #06b6d4);
        box-shadow: 0 6px 24px rgba(168, 85, 247, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.3);
        animation: kfTrialPulse 3s infinite;
      }
      #kfBtnTrial:hover {
        box-shadow: 0 10px 30px rgba(6, 182, 212, 0.75);
      }
      @keyframes kfTrialPulse {
        0%, 100% { box-shadow: 0 4px 18px rgba(168, 85, 247, 0.45); }
        50% { box-shadow: 0 4px 28px rgba(6, 182, 212, 0.7); transform: translateY(-1px); }
      }
      #kfBtnRequestInfo {
        background: rgba(26, 26, 38, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #e2e8f0;
      }
      #kfBtnRequestInfo:hover {
        background: rgba(36, 36, 50, 0.95);
        color: #fff;
      }
      #kfBtnFeedback {
        background: rgba(26, 26, 38, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #e2e8f0;
      }
      #kfBtnFeedback:hover {
        background: rgba(36, 36, 50, 0.95);
        color: #fff;
      }

      #kaoinaiFeedbackModal {
        position: fixed;
        bottom: 76px;
        right: 24px;
        width: 440px;
        max-width: calc(100vw - 32px);
        background: rgba(13, 13, 22, 0.97);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        border: 1px solid rgba(168, 85, 247, 0.4);
        border-radius: 20px;
        box-shadow: 0 24px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(168, 85, 247, 0.25);
        z-index: 99991;
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: kfFadeInUp 0.25s ease-out;
        font-family: inherit;
        max-height: 88vh;
        overflow-y: auto;
      }
      @keyframes kfFadeInUp {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .kf-header {
        padding: 16px 22px 14px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.02);
      }
      .kf-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 800;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .kf-close-btn {
        background: transparent;
        border: none;
        color: #9ca3af;
        font-size: 22px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
        transition: color 0.15s;
      }
      .kf-close-btn:hover { color: #ffffff; }

      .kf-mode-switcher {
        display: flex;
        padding: 12px 20px 0;
        gap: 6px;
      }
      .kf-mode-tab {
        flex: 1;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 8px 4px;
        font-size: 11px;
        font-weight: 700;
        color: #94a3b8;
        cursor: pointer;
        text-align: center;
        transition: all 0.15s ease;
      }
      .kf-mode-tab.active {
        background: rgba(168, 85, 247, 0.22);
        border-color: #a855f7;
        color: #ffffff;
        box-shadow: 0 2px 10px rgba(168, 85, 247, 0.2);
      }

      .kf-routing-badge {
        margin: 10px 20px 0;
        padding: 7px 12px;
        background: rgba(6, 182, 212, 0.08);
        border: 1px solid rgba(6, 182, 212, 0.25);
        border-radius: 8px;
        font-size: 11.5px;
        color: #e2e8f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .kf-routing-badge a {
        color: #38bdf8;
        font-weight: 700;
        text-decoration: underline;
      }

      .kf-body {
        padding: 16px 20px 22px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .kf-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: #c084fc;
        margin-bottom: 6px;
        display: flex;
        justify-content: space-between;
      }
      .kf-input, .kf-select, .kf-textarea {
        width: 100%;
        background: rgba(0, 0, 0, 0.55);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 10px;
        padding: 10px 14px;
        color: #ffffff;
        font-size: 13.5px;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }
      .kf-input:focus, .kf-select:focus, .kf-textarea:focus {
        border-color: #06b6d4;
        box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.25);
      }
      .kf-select option {
        background: #0f0f18;
        color: #fff;
      }
      .kf-textarea {
        min-height: 70px;
        resize: vertical;
      }

      /* Database Pill Selector in Trial Modal */
      .kf-db-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 4px;
      }
      .kf-db-chip {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #cbd5e1;
        border-radius: 999px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .kf-db-chip:hover {
        background: rgba(168, 85, 247, 0.15);
        border-color: rgba(168, 85, 247, 0.4);
        color: #fff;
      }
      .kf-db-chip.active {
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.35), rgba(6, 182, 212, 0.35));
        border-color: #06b6d4;
        color: #fff;
        font-weight: 700;
      }

      .kf-trust-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        font-size: 11px;
        color: #94a3b8;
        margin-top: 2px;
      }
      .kf-trust-row span {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .kf-submit-btn {
        background: linear-gradient(135deg, #a855f7, #06b6d4);
        color: #ffffff;
        border: none;
        border-radius: 10px;
        padding: 13px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.2s ease, transform 0.15s ease;
        box-shadow: 0 4px 16px rgba(168, 85, 247, 0.35);
      }
      .kf-submit-btn:hover { opacity: 0.95; transform: translateY(-1px); }
      .kf-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

      .kf-direct-mailto {
        text-align: center;
        font-size: 11.5px;
        color: #94a3b8;
        margin-top: -4px;
      }
      .kf-direct-mailto a {
        color: #06b6d4;
        text-decoration: underline;
        font-weight: 600;
      }

      .kf-success-msg {
        display: none;
        text-align: center;
        padding: 28px 20px;
      }
      .kf-success-msg h5 {
        color: #22c55e;
        font-size: 18px;
        font-weight: 800;
        margin: 0 0 10px;
      }
      .kf-success-msg p {
        color: #cbd5e1;
        font-size: 13.5px;
        line-height: 1.6;
        margin: 0;
      }

      /* Inactivity Lingering Nudge Toast */
      #kaoinaiLingeringToast {
        position: fixed;
        bottom: 24px;
        left: 24px;
        max-width: 380px;
        background: rgba(15, 15, 24, 0.95);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(168, 85, 247, 0.35);
        border-radius: 16px;
        padding: 14px 18px;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(168, 85, 247, 0.25);
        z-index: 99980;
        display: flex;
        align-items: center;
        gap: 12px;
        animation: kfFadeInUp 0.3s ease-out;
        transition: opacity 0.3s ease;
      }
      #kaoinaiLingeringToast p {
        margin: 0;
        font-size: 12.5px;
        color: #e2e8f0;
        line-height: 1.45;
      }
      #kaoinaiLingeringToast strong {
        color: #fff;
      }
      .kf-toast-btn {
        background: linear-gradient(135deg, #a855f7, #06b6d4);
        color: #fff;
        font-size: 11.5px;
        font-weight: 700;
        padding: 7px 12px;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        white-space: nowrap;
        text-decoration: none;
      }
      .kf-toast-close {
        background: none;
        border: none;
        color: #64748b;
        font-size: 18px;
        cursor: pointer;
        padding: 2px;
      }
      .kf-toast-close:hover { color: #fff; }
      @media (max-width: 640px) {
        #kaoinaiLingeringToast {
          left: 16px;
          right: 16px;
          bottom: 80px;
          max-width: calc(100vw - 32px);
        }
      }
    `;
    const styleEl = document.createElement('style');
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);
  }

  // 3. Render HTML Elements
  function injectWidget() {
    injectStyles();

    const container = document.createElement('div');
    container.id = 'kaoinaiFeedbackWidget';
    container.innerHTML = `
      <!-- Floating Action Cluster -->
      <div id="kaoinaiFloatingCluster">
        <button class="kf-cluster-btn" id="kfBtnTrial" aria-label="Start 14-Day Free Trial">
          <span>⚡</span> Free Trial
        </button>
        <button class="kf-cluster-btn" id="kfBtnRequestInfo" aria-label="Request Information">
          <span>📩</span> Info
        </button>
        <button class="kf-cluster-btn" id="kfBtnFeedback" aria-label="Open Feedback Form">
          <span>💬</span> Feedback
        </button>
      </div>

      <!-- Inbound / Free Trial Modal -->
      <div id="kaoinaiFeedbackModal" role="dialog" aria-modal="true" aria-labelledby="kfModalHeader">
        <div class="kf-header">
          <h4 id="kfModalHeader"><span>🚀</span> Start 14-Day Free Trial</h4>
          <button class="kf-close-btn" id="kfCloseBtn" aria-label="Close dialog">&times;</button>
        </div>

        <div class="kf-mode-switcher">
          <button type="button" class="kf-mode-tab active" id="kfTabTrial" onclick="window.kaoinaiSetMode('trial')">
            🚀 14-Day Free Trial
          </button>
          <button type="button" class="kf-mode-tab" id="kfTabInfo" onclick="window.kaoinaiSetMode('info')">
            📩 Request Info
          </button>
          <button type="button" class="kf-mode-tab" id="kfTabFeedback" onclick="window.kaoinaiSetMode('feedback')">
            💬 Feedback
          </button>
        </div>

        <div class="kf-routing-badge" id="kfRoutingBadge">
          <span id="kfRoutingText">Direct to Founder: <strong>tk.ng@kaoinai.com</strong></span>
          <a href="mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Inquiry" id="kfDirectMailLink" title="Compose in email app">Open in Email ↗</a>
        </div>

        <form id="feedbackFormElement" class="kf-body" action="https://formspree.io/f/xyegdyyj" method="POST">
          <input type="hidden" name="_to" value="tk.ng@kaoinai.com">
          <input type="hidden" name="_cc" value="tk.ng@kaoinai.com">
          <input type="hidden" name="recipient" value="tk.ng@kaoinai.com">
          <input type="hidden" name="_subject" id="kfSubjectField" value="New KaoinAI 14-Day Free Trial Signup (tk.ng@kaoinai.com)">
          <input type="hidden" name="inquiry_type" id="kfInquiryType" value="14-Day Free Trial">
          <input type="hidden" name="selected_database" id="kfSelectedDbInput" value="PostgreSQL">
          <input type="hidden" name="user_activity_log" id="kfActivityLog">

          <div>
            <div class="kf-label">Work Email Address *</div>
            <input type="email" class="kf-input" name="email" id="kfEmailField" placeholder="alex@company.com" required autocomplete="email">
          </div>

          <!-- Trial Specific Fields -->
          <div id="kfTrialFields">
            <div>
              <div class="kf-label">Your Primary Database / Stack</div>
              <div class="kf-db-chips" id="kfDbChips">
                <span class="kf-db-chip active" data-db="PostgreSQL">🐘 PostgreSQL</span>
                <span class="kf-db-chip" data-db="MySQL">🐬 MySQL</span>
                <span class="kf-db-chip" data-db="Snowflake">❄️ Snowflake</span>
                <span class="kf-db-chip" data-db="BigQuery">📊 BigQuery</span>
                <span class="kf-db-chip" data-db="ClickHouse">⚡ ClickHouse</span>
                <span class="kf-db-chip" data-db="SQL Server">🗄️ SQL Server</span>
                <span class="kf-db-chip" data-db="Excel / CSV">📑 Excel / CSV</span>
                <span class="kf-db-chip" data-db="Other">🔧 Other</span>
              </div>
            </div>

            <div style="margin-top: 10px;">
              <div class="kf-label">Primary Objective</div>
              <select class="kf-select" name="primary_goal" id="kfGoalSelect">
                <option value="Fixing Data for AI / LLMs (Zero Hallucinations)">Fixing Data for AI / LLMs (Zero Hallucinations)</option>
                <option value="Automated Column Lineage & Catalog">Automated Column Lineage & Catalog</option>
                <option value="4D Data Quality Monitoring & Schema Drift">4D Data Quality Monitoring & Schema Drift</option>
                <option value="PDPA / PII Statutory Compliance (SG/MY/ID)">PDPA / PII Statutory Compliance (SG/MY/ID)</option>
                <option value="Plain-English Conversational SQL for Non-Technical Team">Plain-English Conversational SQL for Non-Technical Team</option>
              </select>
            </div>

            <div class="kf-trust-row" style="margin-top: 10px;">
              <span>✅ 14-Day Full Platform Access</span>
              <span>✅ 5-Min Database Connection</span>
              <span>✅ No Credit Card Required</span>
              <span>✅ Read-Only &amp; Zero Raw Data Stored</span>
            </div>
          </div>

          <!-- Non-Trial Fields (Info & Feedback) -->
          <div id="kfMessageWrap" style="display: none;">
            <div class="kf-label" id="kfMessageLabel">How Can We Help You?</div>
            <textarea class="kf-textarea" id="kfMessageText" name="message" placeholder="Ask about architecture, pricing, live demo, or compliance..."></textarea>
          </div>

          <button type="submit" class="kf-submit-btn" id="kfSubmitBtn">🚀 Launch My 14-Day Free Trial &rarr;</button>

          <div class="kf-direct-mailto">
            Questions? Contact founder directly: <a href="mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Inquiry" id="kfDirectMailTextLink">tk.ng@kaoinai.com</a>
          </div>
        </form>

        <div class="kf-success-msg" id="kfSuccessMsg">
          <h5>🎉 You're On Your Way!</h5>
          <p id="kfSuccessText">Your 14-day full platform access request has been confirmed. We've dispatched your instant workspace onboarding credentials to your email, and notified our data engineering team at <strong>tk.ng@kaoinai.com</strong>.</p>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Event Bindings
    const modal = document.getElementById('kaoinaiFeedbackModal');
    const closeBtn = document.getElementById('kfCloseBtn');
    const form = document.getElementById('feedbackFormElement');
    const submitBtn = document.getElementById('kfSubmitBtn');
    const successMsg = document.getElementById('kfSuccessMsg');
    const btnTrial = document.getElementById('kfBtnTrial');
    const btnInfo = document.getElementById('kfBtnRequestInfo');
    const btnFeedback = document.getElementById('kfBtnFeedback');
    const trialFields = document.getElementById('kfTrialFields');
    const messageWrap = document.getElementById('kfMessageWrap');
    const messageText = document.getElementById('kfMessageText');
    const selectedDbInput = document.getElementById('kfSelectedDbInput');
    const goalSelect = document.getElementById('kfGoalSelect');
    const emailField = document.getElementById('kfEmailField');

    // Database chip click handlers
    document.querySelectorAll('.kf-db-chip').forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.kf-db-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        selectedDbInput.value = this.dataset.db;
        window.kaoinaiLogAction('Selected DB in Modal', this.dataset.db);
      });
    });

    window.kaoinaiSetMode = function(mode, defaultDb, defaultGoal) {
      const isTrial = mode === 'trial';
      const isInfo = mode === 'info';
      const isFeedback = mode === 'feedback';

      document.getElementById('kfTabTrial').classList.toggle('active', isTrial);
      document.getElementById('kfTabInfo').classList.toggle('active', isInfo);
      document.getElementById('kfTabFeedback').classList.toggle('active', isFeedback);

      if (isTrial) {
        document.getElementById('kfModalHeader').innerHTML = '<span>🚀</span> Start 14-Day Free Trial';
        document.getElementById('kfSubjectField').value = 'New KaoinAI 14-Day Free Trial Signup (tk.ng@kaoinai.com)';
        document.getElementById('kfInquiryType').value = '14-Day Free Trial';
        trialFields.style.display = 'block';
        messageWrap.style.display = 'none';
        messageText.removeAttribute('required');
        submitBtn.textContent = '🚀 Launch My 14-Day Free Trial →';
        document.getElementById('kfDirectMailLink').href = 'mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Free%20Trial%20Inquiry';
        document.getElementById('kfDirectMailTextLink').href = 'mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Free%20Trial%20Inquiry';

        if (defaultDb) {
          document.querySelectorAll('.kf-db-chip').forEach(c => {
            if (c.dataset.db.toLowerCase() === defaultDb.toLowerCase()) {
              c.classList.add('active');
              selectedDbInput.value = c.dataset.db;
            } else {
              c.classList.remove('active');
            }
          });
        }
        if (defaultGoal) {
          goalSelect.value = defaultGoal;
        }
      } else if (isInfo) {
        document.getElementById('kfModalHeader').innerHTML = '<span>📩</span> Request Information';
        document.getElementById('kfSubjectField').value = 'KaoinAI Information Request (tk.ng@kaoinai.com)';
        document.getElementById('kfInquiryType').value = 'Request Information';
        trialFields.style.display = 'none';
        messageWrap.style.display = 'block';
        messageText.setAttribute('required', 'required');
        document.getElementById('kfMessageLabel').textContent = 'What Information Would You Like?';
        messageText.placeholder = 'Tell us about your data stack, compliance requirements (PDPA, etc.), or request a customized demo...';
        submitBtn.textContent = 'Submit Request to tk.ng@kaoinai.com →';
        document.getElementById('kfDirectMailLink').href = 'mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Information%20Request';
        document.getElementById('kfDirectMailTextLink').href = 'mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Information%20Request';
      } else {
        document.getElementById('kfModalHeader').innerHTML = '<span>💬</span> KaoinAI Feedback';
        document.getElementById('kfSubjectField').value = 'KaoinAI Product Feedback (tk.ng@kaoinai.com)';
        document.getElementById('kfInquiryType').value = 'Product Feedback';
        trialFields.style.display = 'none';
        messageWrap.style.display = 'block';
        messageText.setAttribute('required', 'required');
        document.getElementById('kfMessageLabel').textContent = 'Your Feedback & Thoughts';
        messageText.placeholder = 'What caught your eye? Any feature suggestions, ideas, or feedback?';
        submitBtn.textContent = 'Send Feedback to tk.ng@kaoinai.com →';
        document.getElementById('kfDirectMailLink').href = 'mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Feedback';
        document.getElementById('kfDirectMailTextLink').href = 'mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Feedback';
      }
    };

    window.openTrialModal = function(e, defaultDb, defaultGoal, prefilledEmail) {
      if (e && e.preventDefault) e.preventDefault();
      window.kaoinaiSetMode('trial', defaultDb, defaultGoal);
      if (prefilledEmail) {
        emailField.value = prefilledEmail;
      }
      form.style.display = 'flex';
      document.querySelector('.kf-mode-switcher').style.display = 'flex';
      successMsg.style.display = 'none';
      modal.style.display = 'flex';
      emailField.focus();
      window.kaoinaiLogAction('Trial Modal Triggered', (defaultDb || 'Default') + ' | ' + (defaultGoal || 'None'));
    };

    btnTrial.addEventListener('click', (e) => {
      window.openTrialModal(e);
    });

    btnInfo.addEventListener('click', () => {
      window.kaoinaiSetMode('info');
      form.style.display = 'flex';
      document.querySelector('.kf-mode-switcher').style.display = 'flex';
      successMsg.style.display = 'none';
      modal.style.display = 'flex';
      window.kaoinaiLogAction('Widget Opened', 'User clicked Request Info');
    });

    btnFeedback.addEventListener('click', () => {
      window.kaoinaiSetMode('feedback');
      form.style.display = 'flex';
      document.querySelector('.kf-mode-switcher').style.display = 'flex';
      successMsg.style.display = 'none';
      modal.style.display = 'flex';
      window.kaoinaiLogAction('Widget Opened', 'User clicked Feedback');
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Close when clicking outside on mobile or backdrop
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });

    // AJAX Form submission with routing to tk.ng@kaoinai.com
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.innerText = 'Activating Free Trial...';

      // Attach complete user activity log
      document.getElementById('kfActivityLog').value = window.kaoinaiGetActivitySummary();

      const formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(res => {
        if (res.ok) {
          form.style.display = 'none';
          document.querySelector('.kf-mode-switcher').style.display = 'none';
          const isTrial = document.getElementById('kfInquiryType').value === '14-Day Free Trial';
          if (isTrial) {
            document.getElementById('kfSuccessText').innerHTML = `Your 14-day free trial request for <strong>${emailField.value}</strong> has been received! We are setting up your workspace credentials and notifying founder <strong>tk.ng@kaoinai.com</strong>. You will receive an onboarding invite shortly.`;
          }
          successMsg.style.display = 'block';
          window.kaoinaiLogAction('Free Trial Converted', emailField.value + ' | ' + selectedDbInput.value);
          setTimeout(() => {
            modal.style.display = 'none';
          }, 4500);
        } else {
          fallbackMailto();
        }
      })
      .catch(err => {
        fallbackMailto();
      });

      function fallbackMailto() {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit';
        const subj = encodeURIComponent(document.getElementById('kfSubjectField').value);
        const body = encodeURIComponent('Trial Request: ' + selectedDbInput.value + ' | ' + goalSelect.value + '\nEmail: ' + emailField.value);
        window.location.href = `mailto:tk.ng@kaoinai.com?subject=${subj}&body=${body}`;
      }
    });

    
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectWidget();
      autoBindForms();
    });
  } else {
    injectWidget();
    autoBindForms();
  }
})();
