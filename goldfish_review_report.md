# Goldfish Review Report: Interactive Feature Drill-Down Modal & Technical Workflows

**Target:** `I:\kaoinai-website\docs\designs\feature-drilldown-modal.md` (`lines 1-38`)
**Context Files Analyzed:**
- `src/sections/Features.tsx`
- `src/components/FeatureDetailModal.tsx`
- `src/data/featureDetails.ts`
- `src/pages/Contact.tsx`

## Reviewer Status

| Reviewer | Status |
| --- | --- |
| `egm-design` | completed |
| `egm-structural` | completed |
| `egm-implementation-readiness` | completed |
| `egm-codebase-details` | completed |

---

## Prioritized Findings (Blockers -> Major -> Nits)

### 1. Missing WCAG 2.1 AA Focus Trap & Focus Restoration Specifications - Severity: Blocker 🔴
* **Reviewer Lens:** `egm-implementation-readiness` / `egm-design`
* **Affected Scope:** `Lines 23-25` (`Section 2.2 Accessible Dialog Component`)
* **Discrepancy Description**: 
  Line 25 specifies: `Keyboard accessibility: Escape key dismiss, Tab navigation, and body scroll lock on mount (overflow: hidden)`. It fails to specify modal focus containment (trapping `Tab` and `Shift+Tab` within the modal dialog), initial focus placement upon opening, and focus restoration to the originating trigger element on close. 
  Inspection of `src/components/FeatureDetailModal.tsx` (lines 35–54) reveals this architectural defect in code: only an `Escape` key event listener is attached; keyboard users can tab past the modal footer into the inert background document.
* **Rationale & Recommendation**: 
  Under WCAG 2.1 AA Criterion 2.1.2 (No Keyboard Trap) and WAI-ARIA Modal Dialog Pattern, modal overlays must:
  1. Trap tab focus within the dialog container using a focus loop or `focus-trap-react`.
  2. Programmatically focus the initial interactive element or title on mount.
  3. Restore focus back to the triggering grid card upon dismissal.
  Update Section 2.2 to explicitly specify these 3 focus management lifecycle steps.

---

### 2. Semantic Anti-Pattern & Redundant ARIA Specification for Native Buttons - Severity: Blocker 🔴
* **Reviewer Lens:** `egm-codebase-details` / `egm-structural`
* **Affected Scope:** `Line 33` (`Section 2.3 Interactive Features Grid`)
* **Discrepancy Description**: 
  Line 33 dictates: `Card triggers wrapped in semantic keyboard-accessible buttons (role="button", tabIndex={0})`. In HTML5 and WAI-ARIA standards, applying `role="button"` and `tabIndex={0}` to native `<button>` elements violates the W3C First Rule of ARIA. 
  Furthermore, `src/sections/Features.tsx` (lines 162–171) already uses native semantic elements: `<button type="button" onClick=... aria-haspopup="dialog">`. Specifying `role="button"` and `tabIndex={0}` causes ambiguity, risking improper migration to non-semantic `<div>` elements or redundant markup.
* **Rationale & Recommendation**: 
  Change line 33 to mandate native `<button type="button">` elements with `aria-haspopup="dialog"`, explicitly prohibiting redundant `role="button"` and `tabIndex={0}` attributes on native buttons.

---

### 3. Missing Core Specification Sections (Non-Goals, KPIs, Alternatives, Security) - Severity: Major 🟡
* **Reviewer Lens:** `egm-structural`
* **Affected Scope:** `Lines 1-38` (Full Document)
* **Discrepancy Description**: 
  At only 38 lines, the document lacks essential sections mandated by `feature-spec-standard`:
  - **Non-Goals / Scope Boundaries**: Does not define whether features support direct URL routes (e.g. `/features/:slug`), browser history manipulation (`window.history.pushState`), or feature comparison.
  - **KPIs & Success Metrics**: Lacks quantitative targets (e.g. card click-through rate, LeadMagnet download rate, consultation conversion rate).
  - **Alternative Solutions Evaluated**: Omits why an inline accordion or dedicated product sub-pages were rejected in favor of an overlay dialog.
  - **Security & Privacy Considerations**: Omits input sanitization requirements for the deep-link query parameter `?topic=` and XSS protections for rendered code blocks.
* **Rationale & Recommendation**: 
  Expand the document with Section 3 (Non-Goals), Section 4 (Success Metrics), Section 5 (Alternatives Considered), and Section 6 (Security & Edge Cases) to achieve full architectural readiness.

---

### 4. Unspecified Component States (Lazy Loading Fallback, Clipboard Feedback, Error Boundaries) - Severity: Major 🟡
* **Reviewer Lens:** `egm-design` / `egm-implementation-readiness`
* **Affected Scope:** `Lines 23-35` (`Section 2.2 & 2.3`)
* **Discrepancy Description**: 
  Line 35 specifies lazy loading via `React.lazy`, but omits visual feedback during chunk download. In `Features.tsx` line 249, `<Suspense fallback={null}>` is rendered, causing a frozen/unresponsive UI state on slow networks when a user clicks a card. 
  Additionally, Section 2.2 omits specifications for:
  - Technical artifact copy button states (`Default` -> `Copied!` tooltip -> `Error/Unsupported`).
  - Empty or invalid state handling if an unrecognized `featureId` is supplied.
* **Rationale & Recommendation**: 
  Update Section 2.2 and 2.3 to specify:
  1. A minimal skeleton or loading spinner fallback for `Suspense`.
  2. Copy button interaction feedback states (2000ms confirmation badge and clipboard permission denial fallback).
  3. Graceful dismissal or error boundary if `featureDetails[featureId]` is undefined.

---

### 5. Spec-to-Codebase Divergence in UI Copy, Tab Labels, and Deep-Link Handling - Severity: Major 🟡
* **Reviewer Lens:** `egm-codebase-details`
* **Affected Scope:** `Lines 26, 30, 34, 37-38`
* **Discrepancy Description**: 
  Multiple copy and structural divergences exist between the design spec and the production code:
  1. **Badge Copy:** Spec line 34 states `"Explore technical specs & code →"`, but `Features.tsx` line 186 renders `"Explore workflow & code"`.
  2. **CTA Label:** Spec line 30 states `"Download Free PDPA Checklist (PDF)"`, but `FeatureDetailModal.tsx` line 329 renders `"Free PDPA Checklist (PDF)"`.
  3. **Tab Nomenclature:** Spec line 26 lists `Workflow`, `Technical Artifact`, `Compliance & Engines`, but `FeatureDetailModal.tsx` implements `Operational Workflow`, `Code & Config Artifact`, and `Compliance & Engines`.
  4. **Deep-Link Ingestion Completeness:** Line 38 notes pre-selecting the consultation agenda in `Contact.tsx`. However, `Contact.tsx` lines 153–159 only populates the 1-on-1 booking tab (`bookingTopic`), leaving the secondary general inquiry form (`inquiryType`) unconfigured, without input length truncation or validation against the 14 valid topics.
* **Rationale & Recommendation**: 
  Reconcile the design document with verified codebase strings or specify intentional updates. Expand Section 2.4 to detail topic parameter validation, fallback behavior, and support across both calendar and inquiry tabs in `Contact.tsx`.

---

### 6. Missing Mobile Bottom-Sheet Gesture & Safe-Area Inset Specifications - Severity: Nit 🟢
* **Reviewer Lens:** `egm-design` / `egm-implementation-readiness`
* **Affected Scope:** `Line 27` (`Section 2.2 Mobile layout`)
* **Discrepancy Description**: 
  Line 27 specifies: `Mobile layout: Fluid bottom-sheet drawer with sticky dual-action footer`. The document provides no technical details on swipe-to-dismiss velocity/distance thresholds, touch drag affordances, or iOS viewport height handling (`100dvh` vs `100vh`). In code (`FeatureDetailModal.tsx`), it currently renders as a standard centered modal rather than a native bottom sheet.
* **Rationale & Recommendation**: 
  Specify whether a true bottom-sheet gesture is required or if a responsive full-screen/centered dialog is acceptable. Mandate `pb-[env(safe-area-inset-bottom)]` on the sticky footer to prevent button clipping on iOS devices.

---

### 7. Code Layout: React Hook Declaration Order in Contact Page - Severity: Nit 🟢
* **Reviewer Lens:** `egm-codebase-details`
* **Affected Scope:** `Lines 37-38` (`Section 2.4`)
* **Discrepancy Description**: 
  In `src/pages/Contact.tsx` lines 153–161, a `useEffect` hook referencing `setBookingTopic` is placed prior to the declaration of `const [bookingTopic, setBookingTopic] = useState(...)`. While permitted at runtime, this violates idiomatic React conventions.
* **Rationale & Recommendation**: 
  Document standard hook ordering guidelines in technical implementation notes: group all state hooks before lifecycle and synchronization effects.
