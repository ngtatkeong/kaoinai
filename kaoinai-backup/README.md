# KaoinAI Animated Background — Backup

This directory holds the **animated background system** that was removed from the
live static site on 2026-09-21 (content untouched; only the background layer was backed out).

## Contents

- `assets/kaoinai-refresh.css` — additive visual layer: animated CSS aurora backdrop,
  grid + grain overlay, glass navbar, gradient buttons/cards, scroll-reveal styles,
  page fade-in, reduced-motion support.
- `assets/kaoinai-nebula.js` — self-hosted WebGL aurora background (domain-warped fbm
  shader in the KaoinAI violet/cyan palette; pointer parallax, scroll-linked dimming,
  pauses when hidden, CSS fallback).
- `assets/kaoinai-dynamics.js` — data-lineage particle canvas, scroll reveals, navbar
  state, scrollspy, 3D card tilt, magnetic buttons, back-to-top, click ripple.
- `images/kd-aurora-lineage.webp` — fixed backdrop artwork.
- `images/kd-governance-core.webp` — CTA section artwork.
- `inject_refresh_assets.py` — idempotent injector that re-adds the `<link>`/`<script>`
  tags to all 13 site pages.
- `backup_animation_assets.py` — the removal script that produced this backup.

## Restore

1. Copy `assets/` and `images/` back to the site root.
2. Run `python kaoinai-backup/inject_refresh_assets.py` (from the site root it
   inserts the tags; run `python scratch/inject_refresh_assets.py` if you moved it back there).

## Notes

- The system is purely additive: it never changed page content, only background,
  surfaces, and motion.
- Honors `prefers-reduced-motion` and skips WebGL when unavailable.
