/**
 * KaoinAI Visitor Telemetry, Feedback & Information Request Engine
 * Automatically captures visitor user journeys, interactions, and inquiries,
 * routing all submissions and direct mailto actions to tk.ng@kaoinai.com.
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

  // 2. Inject CSS Styles for Floating Feedback & Request Information Widget
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
      #kfBtnRequestInfo {
        background: linear-gradient(135deg, #06b6d4, #0284c7);
        box-shadow: 0 6px 20px rgba(6, 182, 212, 0.4);
      }
      #kfBtnRequestInfo:hover {
        box-shadow: 0 10px 25px rgba(6, 182, 212, 0.6);
      }
      #kfBtnFeedback {
        background: linear-gradient(135deg, #a855f7, #7c3aed);
        box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
      }
      #kfBtnFeedback:hover {
        box-shadow: 0 10px 25px rgba(168, 85, 247, 0.6);
      }

      #kaoinaiFeedbackModal {
        position: fixed;
        bottom: 76px;
        right: 24px;
        width: 380px;
        max-width: calc(100vw - 32px);
        background: rgba(15, 15, 25, 0.96);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border: 1px solid rgba(168, 85, 247, 0.35);
        border-radius: 16px;
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(168, 85, 247, 0.2);
        z-index: 99991;
        display: none;
        flex-direction: column;
        overflow: hidden;
        animation: kfFadeInUp 0.25s ease-out;
        font-family: inherit;
      }
      @keyframes kfFadeInUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .kf-header {
        padding: 16px 20px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.02);
      }
      .kf-header h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 800;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .kf-close-btn {
        background: transparent;
        border: none;
        color: #9ca3af;
        font-size: 20px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
      }
      .kf-close-btn:hover { color: #ffffff; }

      .kf-mode-switcher {
        display: flex;
        padding: 10px 20px 0;
        gap: 8px;
      }
      .kf-mode-tab {
        flex: 1;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        padding: 7px 4px;
        font-size: 11.5px;
        font-weight: 700;
        color: #94a3b8;
        cursor: pointer;
        text-align: center;
        transition: all 0.15s ease;
      }
      .kf-mode-tab.active {
        background: rgba(168, 85, 247, 0.2);
        border-color: #a855f7;
        color: #ffffff;
      }

      .kf-routing-badge {
        margin: 10px 20px 0;
        padding: 6px 10px;
        background: rgba(6, 182, 212, 0.08);
        border: 1px solid rgba(6, 182, 212, 0.25);
        border-radius: 6px;
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
        padding: 14px 20px 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .kf-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #c084fc;
        margin-bottom: 4px;
      }
      .kf-input, .kf-textarea {
        width: 100%;
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 8px;
        padding: 9px 12px;
        color: #ffffff;
        font-size: 13px;
        box-sizing: border-box;
        outline: none;
      }
      .kf-input:focus, .kf-textarea:focus {
        border-color: #06b6d4;
      }
      .kf-textarea {
        min-height: 75px;
        resize: vertical;
      }
      .kf-submit-btn {
        background: linear-gradient(135deg, #a855f7, #06b6d4);
        color: #ffffff;
        border: none;
        border-radius: 8px;
        padding: 11px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }
      .kf-submit-btn:hover { opacity: 0.92; }
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
        padding: 24px 16px;
      }
      .kf-success-msg h5 {
        color: #22c55e;
        font-size: 16px;
        margin: 0 0 8px;
      }
      .kf-success-msg p {
        color: #9ca3af;
        font-size: 12.5px;
        line-height: 1.5;
        margin: 0;
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
        <button class="kf-cluster-btn" id="kfBtnRequestInfo" aria-label="Request Information">
          <span>📩</span> Request Info
        </button>
        <button class="kf-cluster-btn" id="kfBtnFeedback" aria-label="Open Feedback Form">
          <span>💬</span> Feedback
        </button>
      </div>

      <!-- Inbound Modal -->
      <div id="kaoinaiFeedbackModal">
        <div class="kf-header">
          <h4 id="kfModalHeader"><span>✨</span> KaoinAI Inquiry</h4>
          <button class="kf-close-btn" id="kfCloseBtn">&times;</button>
        </div>

        <div class="kf-mode-switcher">
          <button type="button" class="kf-mode-tab active" id="kfTabInfo" onclick="window.kaoinaiSetMode('info')">
            📩 Request Information
          </button>
          <button type="button" class="kf-mode-tab" id="kfTabFeedback" onclick="window.kaoinaiSetMode('feedback')">
            💬 Feedback
          </button>
        </div>

        <div class="kf-routing-badge">
          <span>Direct to: <strong>tk.ng@kaoinai.com</strong></span>
          <a href="mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Inquiry" id="kfDirectMailLink" title="Compose in email app">Open in Email ↗</a>
        </div>

        <form id="feedbackFormElement" class="kf-body" action="https://formspree.io/f/xyegdyyj" method="POST">
          <input type="hidden" name="_to" value="tk.ng@kaoinai.com">
          <input type="hidden" name="_cc" value="tk.ng@kaoinai.com">
          <input type="hidden" name="recipient" value="tk.ng@kaoinai.com">
          <input type="hidden" name="_subject" id="kfSubjectField" value="KaoinAI Information Request (tk.ng@kaoinai.com)">
          <input type="hidden" name="inquiry_type" id="kfInquiryType" value="Request Information">
          <input type="hidden" name="user_activity_log" id="kfActivityLog">

          <div>
            <div class="kf-label" id="kfMessageLabel">How Can We Help You?</div>
            <textarea class="kf-textarea" id="kfMessageText" name="message" placeholder="Ask about architecture, pricing, live demo, or compliance..." required></textarea>
          </div>

          <div>
            <div class="kf-label">Your Email Address</div>
            <input type="email" class="kf-input" name="email" id="kfEmailField" placeholder="name@company.com" required>
          </div>

          <button type="submit" class="kf-submit-btn" id="kfSubmitBtn">Submit to tk.ng@kaoinai.com &rarr;</button>

          <div class="kf-direct-mailto">
            Prefer direct mail? Email <a href="mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Inquiry" id="kfDirectMailTextLink">tk.ng@kaoinai.com</a> directly.
          </div>
        </form>

        <div class="kf-success-msg" id="kfSuccessMsg">
          <h5>🎉 Received!</h5>
          <p>Your request has been forwarded to <strong>tk.ng@kaoinai.com</strong>. We will review your message and reply promptly.</p>
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
    const btnInfo = document.getElementById('kfBtnRequestInfo');
    const btnFeedback = document.getElementById('kfBtnFeedback');

    window.kaoinaiSetMode = function(mode) {
      const isInfo = mode === 'info';
      document.getElementById('kfTabInfo').classList.toggle('active', isInfo);
      document.getElementById('kfTabFeedback').classList.toggle('active', !isInfo);

      if (isInfo) {
        document.getElementById('kfModalHeader').innerHTML = '<span>📩</span> Request Information';
        document.getElementById('kfSubjectField').value = 'KaoinAI Information Request (tk.ng@kaoinai.com)';
        document.getElementById('kfInquiryType').value = 'Request Information';
        document.getElementById('kfMessageLabel').textContent = 'What Information Would You Like?';
        document.getElementById('kfMessageText').placeholder = 'Tell us about your data stack, compliance requirements (PDPA, etc.), or request a customized demo...';
        document.getElementById('kfSubmitBtn').textContent = 'Submit Request to tk.ng@kaoinai.com →';
        document.getElementById('kfDirectMailLink').href = 'mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Information%20Request';
        document.getElementById('kfDirectMailTextLink').href = 'mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Information%20Request';
      } else {
        document.getElementById('kfModalHeader').innerHTML = '<span>💬</span> KaoinAI Feedback';
        document.getElementById('kfSubjectField').value = 'KaoinAI Product Feedback (tk.ng@kaoinai.com)';
        document.getElementById('kfInquiryType').value = 'Product Feedback';
        document.getElementById('kfMessageLabel').textContent = 'Your Feedback & Thoughts';
        document.getElementById('kfMessageText').placeholder = 'What caught your eye? Any feature suggestions, ideas, or feedback?';
        document.getElementById('kfSubmitBtn').textContent = 'Send Feedback to tk.ng@kaoinai.com →';
        document.getElementById('kfDirectMailLink').href = 'mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Feedback';
        document.getElementById('kfDirectMailTextLink').href = 'mailto:tk.ng@kaoinai.com?subject=KaoinAI%20Feedback';
      }
    };

    btnInfo.addEventListener('click', () => {
      window.kaoinaiSetMode('info');
      modal.style.display = 'flex';
      window.kaoinaiLogAction('Widget Opened', 'User clicked Request Info');
    });

    btnFeedback.addEventListener('click', () => {
      window.kaoinaiSetMode('feedback');
      modal.style.display = 'flex';
      window.kaoinaiLogAction('Widget Opened', 'User clicked Feedback');
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // AJAX Form submission with routing to tk.ng@kaoinai.com
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.innerText = 'Routing to tk.ng@kaoinai.com...';

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
          successMsg.style.display = 'block';
          window.kaoinaiLogAction('Inquiry Sent', 'Routed to tk.ng@kaoinai.com');
          setTimeout(() => {
            modal.style.display = 'none';
          }, 3500);
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
        const body = encodeURIComponent(document.getElementById('kfMessageText').value + '\n\nSender Email: ' + document.getElementById('kfEmailField').value);
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
