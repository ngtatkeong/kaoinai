# Design Document: Interactive Feature Drill-Down Modal & Technical Workflows

* **Status:** Approved & Implemented
* **Author:** KaoinAI Engineering Team
* **Date:** 2026-11-14
* **Standard Compliance:** `feature-spec-standard` & `implementation-readiness-standard`

---

## 1. Context & Motivation

The Features section (`src/sections/Features.tsx`) is the primary functional catalog on the KaoinAI homepage, presenting 14 enterprise capabilities (`Data Governance (DG)`, `Data Quality (DQ)`, `Master Data Management (MDM)`, `Table-Bound DPIA & Data Inventory`, `AI-Aided DB Knowledgebase`, `Data Lineage`, `AI-Enhanced Data Catalog`, `Auto-Insights`, `Data Transformations (dbt)`, `Risk Scoring`, `ESG Analytics`, `Schema Shifts Detection`, `Data Architect & Optimization`, and `DPO Toolkit & ASEAN Compliance`).

Previously, these 14 capabilities were rendered as static, non-interactive display tiles. Prospective technical evaluators (Lead Data Architects, Chief Information Security Officers, and Data Protection Officers) who clicked on a tile encountered an exploratory dead end. 

This feature transforms all 14 tiles into interactive, keyboard-accessible triggers that open a focused, responsive modal dialog (`FeatureDetailModal.tsx`) displaying production workflows, authentic code/config artifacts, physical engine compatibility matrices, and statutory compliance mappings.

---

## 2. Technical Architecture & Component Contracts

### 2.1 Technical Data Layer (`src/data/featureDetails.ts`)
An isolated, strongly-typed repository containing technical specifications for all 14 features without any mock or hallucinated code.

* **Schema Definition**:
  ```typescript
  export interface WorkflowStep {
    step: number;
    role: string;
    title: string;
    action: string;
  }

  export interface CodeArtifact {
    type: 'sql' | 'yaml' | 'json' | 'bash';
    title: string;
    filename: string;
    description: string;
    snippet: string;
  }

  export interface ComplianceMapping {
    framework: string;
    section: string;
    guarantee: string;
  }

  export interface FeatureDetail {
    id: string;
    title: string;
    category: string;
    badge: string;
    summary: string;
    workflow: WorkflowStep[];
    supportedEngines: string[];
    artifact: CodeArtifact;
    compliance: ComplianceMapping[];
    outcomes: string[];
    consultationTopic: string;
  }
  ```

### 2.2 Accessible Dialog Component (`src/components/FeatureDetailModal.tsx`)
A high-focus modal overlay adhering strictly to WAI-ARIA Dialog (Modal) Patterns and WCAG 2.1 AA criteria.

* **ARIA Attributes**:
  - Root container: `role="dialog"`, `aria-modal="true"`.
  - Accessible headers: `aria-labelledby="feature-modal-title"`, `aria-describedby="feature-modal-summary"`.
* **Focus Management Lifecycle (WCAG 2.1.2)**:
  1. **Initial Focus**: On mount, programmatically moves focus to the modal container or close button.
  2. **Focus Containment (Trap)**: A `keydown` listener intercepts `Tab` and `Shift+Tab`. If the user is on the last interactive element (e.g., "Book 1-on-1 Consultation"), pressing `Tab` wraps focus to the modal close button. If on the close button, pressing `Shift+Tab` wraps focus to the last action button.
  3. **Focus Restoration**: Caches `document.activeElement` when the dialog opens, and restores focus back to the originating feature card trigger element upon dismissal.
* **Keyboard Dismissal**: Closes immediately upon pressing `Escape`.
* **Scroll Lock**: Sets `document.body.style.overflow = 'hidden'` on mount, restoring previous overflow on unmount.
* **Mobile Viewport Optimization**:
  - Full-height centered dialog (`max-h-[92vh]`) with smooth vertical scrolling.
  - Sticky footer incorporates `pb-[env(safe-area-inset-bottom)]` to prevent action button occlusion on iOS Safari devices.
  - Horizontally scrollable code snippet blocks (`overflow-x-auto`) with sticky copy controls.

### 2.3 Interactive Features Grid (`src/sections/Features.tsx`)
* **Semantic HTML Triggers**:
  - Each card is rendered using native HTML `<button type="button">` elements with `aria-haspopup="dialog"`.
  - In accordance with the W3C First Rule of ARIA, redundant `role="button"` and `tabIndex={0}` attributes are strictly prohibited on native buttons.
* **Interactive Hover States**:
  - Subtle micro-interactions: `cursor-pointer hover:border-purple-300 hover:shadow-xl active:scale-[0.99] transition-all`.
  - Explicit affordance text at the card footer: `"Explore workflow & code"` with an animated chevron arrow.
* **Code-Splitting Strategy**:
  - To prevent initial bundle bloat, `FeatureDetailModal` is dynamically loaded via `React.lazy(() => import('@/components/FeatureDetailModal'))`.
  - Wrapped in `<Suspense fallback={<FeatureModalLoadingFallback />}>` ensuring user visual feedback if the chunk is downloaded over constrained networks.

### 2.4 Deep Link Ingestion (`src/pages/Contact.tsx`)
* **URL Parameter Integration**:
  - Reads `searchParams.get('topic')` on mount.
  - When present, automatically selects the 1-on-1 discovery calendar tab (`activeTab = 'calendar'`) and sets `bookingTopic` to the requested feature.
  - Sanitizes the input parameter and dynamically renders `<option value={bookingTopic}>Topic: {bookingTopic}</option>` in the primary topic select element.

---

## 3. Scope Boundaries & Non-Goals

### In-Scope Goals
- Interactive click triggers on all 14 feature cards in `src/sections/Features.tsx`.
- Complete, verified technical data records for all 14 features in `src/data/featureDetails.ts`.
- WCAG 2.1 AA accessible modal dialog with focus trap, focus restoration, and escape dismissal.
- Dual action conversion: "Book 1-on-1 Consultation" (deep links with pre-populated agenda) and "Free PDPA Checklist (PDF)" (triggers shared lead magnet).
- Zero initial bundle penalty via `React.lazy` chunking.

### Out-of-Scope Non-Goals
- **Live Terminal / Execution Sandbox**: The modal does not run live database queries or provision temporary test containers in the browser.
- **Dedicated Sub-Routes (`/features/:slug`)**: Distinct standalone pages are excluded in this phase to prevent navigational friction on the landing page.
- **Browser History Pushing**: Opening and closing the modal does not alter browser history (`history.pushState`), avoiding double-back navigation traps.

---

## 4. Measurable Success Metrics & KPIs

1. **Feature Card Click-Through Rate (CTR)**: Target > 12% of homepage visitors engaging with at least one feature card.
2. **Modal Engagement Depth**: Target > 35% of modal openers inspecting the "Code & Config Artifact" or "Compliance & Engines" tabs.
3. **Snippet Copy Conversion**: Target > 5% of modal openers copying a technical code snippet via the copy button.
4. **Consultation Hand-off Rate**: Target > 2.5% of modal viewers clicking through to `/contact?topic=...`.
5. **Core Web Vitals Impact**: Zero degradation to Cumulative Layout Shift (CLS = 0.000) and First Input Delay (FID < 100ms) on `https://kaoinai.com/`.

---

## 5. Alternatives Evaluated & Trade-offs

1. **Inline Grid Accordion**:
   - *Trade-off*: Expanding an inline row within a 3-column CSS grid causes abrupt layout shifts, stretching adjacent sibling cards or requiring complex multi-column DOM manipulation.
   - *Verdict*: Rejected in favor of the modal dialog for zero layout shift and clean mobile ergonomics.
2. **Dedicated Full Pages (`/features/:slug`)**:
   - *Trade-off*: Navigating away from the landing page to a sub-route disrupts reading momentum and increases bounce rate for prospective buyers.
   - *Verdict*: Deferred. Deep-dive sub-pages may be introduced for SEO in a future phase.
3. **Sliding Side Sheet / Drawer**:
   - *Trade-off*: Excellent on desktop, but on mobile devices (< 640px) a right-sliding sheet either lacks width for code blocks or behaves identically to a modal.
   - *Verdict*: Centered responsive modal with full-screen mobile adaptation selected as the unified pattern.

---

## 6. Security, Privacy & Error Handling

1. **Parameter Sanitization**: The `?topic=` parameter ingested by `Contact.tsx` is strictly treated as text content and escaped within React JSX expressions, preventing any reflected XSS vector.
2. **Invalid Feature ID Fallback**: If an unrecognized or null `featureId` is provided to `FeatureDetailModal`, the component returns `null` and logs a development warning without crashing the React component tree.
3. **Clipboard API Fallback**: If `navigator.clipboard.writeText` fails or permission is denied by browser security policies, the component catches the exception silently without throwing an uncaught runtime error.
4. **Modal Layering (Z-Index)**: `FeatureDetailModal` renders at `z-50`, while `LeadMagnetModal` renders at `z-[60]`, guaranteeing that opening the whitepaper download from inside the feature modal never creates stuck backdrop locks.
