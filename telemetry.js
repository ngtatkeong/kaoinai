/**
 * KaoinAI Visitor Telemetry & Interactive Feedback Widget
 * Automatically captures visitor user journeys, interactions, and feedback submissions
 * and forwards full telemetry payloads via Formspree.
 */
(function() {
  const SESSION_KEY = 'kaoinai_telemetry_v1';
  
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
      });
    });
  }

  // 2. Inject CSS Styles for Floating Feedback Widget
  function injectStyles() {
    const css = `
      #kaoinaiFeedbackTrigger {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99990;
        background: linear-gradient(135deg, #a855f7, #06b6d4);
        color: #ffffff;
        border: none;
        border-radius: 999px;
        padding: 10px 18px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 8px 24px rgba(168, 85, 247, 0.4);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      #kaoinaiFeedbackTrigger:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(168, 85, 247, 0.6);
      }
      #kaoinaiFeedbackModal {
        position: fixed;
        bottom: 80px;
        right: 24px;
        width: 360px;
        max-width: calc(100vw - 32px);
        background: rgba(18, 18, 28, 0.95);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(168, 85, 247, 0.3);
        border-radius: 16px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(168, 85, 247, 0.2);
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
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255, 255, 255, 0.02);
      }
      .kf-header h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: #ffffff;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .kf-close-btn {
        background: transparent;
        border: none;
        color: #9ca3af;
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        line-height: 1;
      }
      .kf-close-btn:hover { color: #ffffff; }
      .kf-body {
        padding: 18px 20px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .kf-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #c084fc;
        margin-bottom: 6px;
      }
      .kf-category-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
      }
      .kf-cat-btn {
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 8px 6px;
        font-size: 11px;
        color: #d1d5db;
        cursor: pointer;
        text-align: center;
        transition: all 0.15s ease;
      }
      .kf-cat-btn:hover, .kf-cat-btn.active {
        background: rgba(168, 85, 247, 0.2);
        border-color: #a855f7;
        color: #ffffff;
      }
      .kf-rating-row {
        display: flex;
        justify-content: space-between;
        gap: 4px;
      }
      .kf-rating-btn {
        flex: 1;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 6px 2px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .kf-rating-btn:hover, .kf-rating-btn.active {
        background: rgba(6, 182, 212, 0.2);
        border-color: #06b6d4;
        transform: scale(1.1);
      }
      .kf-input, .kf-textarea {
        width: 100%;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 10px 12px;
        color: #ffffff;
        font-size: 13px;
        box-sizing: border-box;
        outline: none;
      }
      .kf-input:focus, .kf-textarea:focus {
        border-color: #a855f7;
      }
      .kf-textarea {
        min-height: 70px;
        resize: vertical;
      }
      .kf-submit-btn {
        background: linear-gradient(135deg, #a855f7, #7c3aed);
        color: #ffffff;
        border: none;
        border-radius: 8px;
        padding: 11px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s ease;
      }
      .kf-submit-btn:hover { opacity: 0.9; }
      .kf-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
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
        font-size: 12px;
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
      <button id="kaoinaiFeedbackTrigger" aria-label="Open Feedback Form">
        <span>💬</span> Feedback
      </button>

      <div id="kaoinaiFeedbackModal">
        <div class="kf-header">
          <h4><span>✨</span> KaoinAI Feedback</h4>
          <button class="kf-close-btn" id="kfCloseBtn">&times;</button>
        </div>

        <form id="feedbackFormElement" class="kf-body" action="https://formspree.io/f/xyegdyyj" method="POST">
          <input type="hidden" name="_subject" value="New KaoinAI Visitor Feedback &amp; Session Activity">
          <input type="hidden" name="feedback_category" id="kfSelectedCategory" value="Product Feedback">
          <input type="hidden" name="rating" id="kfSelectedRating" value="5">
          <input type="hidden" name="user_activity_log" id="kfActivityLog">

          <div>
            <div class="kf-label">Feedback Category</div>
            <div class="kf-category-grid">
              <button type="button" class="kf-cat-btn active" data-cat="Product Feedback">💡 Feature / Product</button>
              <button type="button" class="kf-cat-btn" data-cat="Advisory Inquiry">💼 Consulting Inquiry</button>
              <button type="button" class="kf-cat-btn" data-cat="Bug / Question">🐞 Report Issue</button>
              <button type="button" class="kf-cat-btn" data-cat="General Thoughts">⭐ General Feedback</button>
            </div>
          </div>

          <div>
            <div class="kf-label">Experience Rating</div>
            <div class="kf-rating-row">
              <button type="button" class="kf-rating-btn active" data-rate="5" title="Excellent">😍</button>
              <button type="button" class="kf-rating-btn" data-rate="4" title="Good">😃</button>
              <button type="button" class="kf-rating-btn" data-rate="3" title="Neutral">😐</button>
              <button type="button" class="kf-rating-btn" data-rate="2" title="Poor">🙁</button>
              <button type="button" class="kf-rating-btn" data-rate="1" title="Bad">😡</button>
            </div>
          </div>

          <div>
            <div class="kf-label">Your Thoughts</div>
            <textarea class="kf-textarea" name="message" placeholder="What caught your eye? Any questions or suggestions?" required></textarea>
          </div>

          <div>
            <div class="kf-label">Your Email</div>
            <input type="email" class="kf-input" name="email" placeholder="name@company.com" required>
          </div>

          <button type="submit" class="kf-submit-btn" id="kfSubmitBtn">Send Feedback &rarr;</button>
        </form>

        <div class="kf-success-msg" id="kfSuccessMsg">
          <h5>🎉 Thank you!</h5>
          <p>Your feedback and complete session log have been received. We will follow up shortly!</p>
        </div>
      </div>
    `;

    document.body.appendChild(container);

    // Event Bindings
    const trigger = document.getElementById('kaoinaiFeedbackTrigger');
    const modal = document.getElementById('kaoinaiFeedbackModal');
    const closeBtn = document.getElementById('kfCloseBtn');
    const form = document.getElementById('feedbackFormElement');
    const submitBtn = document.getElementById('kfSubmitBtn');
    const successMsg = document.getElementById('kfSuccessMsg');

    trigger.addEventListener('click', () => {
      const isVisible = modal.style.display === 'flex';
      modal.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        window.kaoinaiLogAction('Widget Opened', 'User opened Feedback Form');
      }
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Category button selection
    modal.querySelectorAll('.kf-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kf-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('kfSelectedCategory').value = btn.getAttribute('data-cat');
        window.kaoinaiLogAction('Selected Category', btn.getAttribute('data-cat'));
      });
    });

    // Rating selection
    modal.querySelectorAll('.kf-rating-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.kf-rating-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('kfSelectedRating').value = btn.getAttribute('data-rate');
        window.kaoinaiLogAction('Selected Rating', btn.getAttribute('data-rate') + ' Stars');
      });
    });

    // AJAX Form submission with full Telemetry report
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.innerText = 'Sending...';

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
          successMsg.style.display = 'block';
          window.kaoinaiLogAction('Feedback Sent', 'Submitted successfully via Formspree');
          setTimeout(() => {
            modal.style.display = 'none';
          }, 3500);
        } else {
          submitBtn.disabled = false;
          submitBtn.innerText = 'Try Again';
          alert('Submission failed. Please try again or email info@kaoinai.com');
        }
      })
      .catch(err => {
        submitBtn.disabled = false;
        submitBtn.innerText = 'Try Again';
        alert('Network error. Please try again.');
      });
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
