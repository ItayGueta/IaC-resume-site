# Homepage Refinement TODO

## Positioning & Content

- [ ] Drop achievement list for scrutiny — software dev + devops + AI cost optimization angle
- [ ] Define 3-5 project case studies (Problem → Constraints → Approach → Outcome → Tradeoffs)
- [ ] Extract impact metrics (numbers that prove results)

## Copy

- [ ] Rewrite hero pretitle (`I don't just prompt.`) — less cringe
- [ ] Rewrite hero subtitle — needs to hit harder, shorter
- [ ] Rewrite all 5 card bodies — current text is placeholder
- [ ] Rewrite card titles if needed
- [ ] Rewrite section eyebrows and subs
- [ ] Rewrite pipeline stage labels/descriptions
- [ ] German translations (`content/de/_index.md`) for any changed copy

## Buzzword Mode

- [ ] Expand with more absurd copy across all `data-buzz` attributes
- [ ] Add silly graphs — fake charts that only appear in buzzword mode:
  - "Synergy Index" going up and to the right
  - "Disruption Potential" bar chart (all bars maxed)
  - "AI Maturity" donut chart (always 100%)
  - "Token Efficiency" with completely made-up numbers
  - Could be SVG/CSS-only, toggled by `.buzzword-mode` on body
- [ ] Maybe a "Download Whitepaper" button that only appears in buzzword mode (does nothing or rickrolls)

## Shape Language System (→ Design Log #007)

Replace particle network with a semantic geometric shape language: cyan (technical) + amber (results), domain-recognizable topologies (neural net, K8s mesh, pipeline DAG). Shapes as vocabulary, not decoration.

- [ ] Phase 1: Hero SVG composition (replace canvas + particle IIFE)
- [ ] Phase 2: Section accent motifs (K8s/neural/pipeline corner SVGs)
- [ ] Phase 3: Polish — parallax, buzzword mode, reduced-motion

## Layout Restructure (→ Design Log #006)

Replace the Hero → Cards → Pipeline → CV stack with project case studies that demonstrate real work across software dev, DevOps, and AI. Cards get absorbed into a compact methodology grid. Pipeline becomes a case study rather than a standalone diagram.

- [ ] Phase 1: Case study partial + infrastructure case study (content from #001/#002)
- [ ] Phase 2: Compact methodology grid (replace 5 full-height cards)
- [ ] Phase 3: Placeholder case studies 2 & 3 (user to provide project content)
- [ ] Phase 4: Reveal variety — left/right/scale directions instead of uniform fade-up

## i18n — German page is fake German

The DE page renders all the new partials as-is: hero, cards, pipeline, and CV section labels
are all hardcoded English. Only `_index.md` content and the nav language toggle are actually
translated. Need proper bilingual support:

- [ ] Move all hardcoded copy into Hugo i18n files (`site/i18n/en.toml`, `site/i18n/de.toml`)
- [ ] Refactor partials to use `{{ i18n "key" }}` instead of inline English
- [ ] Translate all strings: hero, 5 card titles/bodies, pipeline labels, section headers, CV labels
- [ ] German buzzword mode copy (or just share the English absurdity as "international business German")
- [ ] Test both languages with buzzword mode toggled on/off

## Visual Bugs

- [x] CV section: blue "See my resume" link → cyan CTA pill button
- [x] CV section: random blue background gradient → site bg (`--bg-deep`)
- [x] CV section: PDF card embed selector bug (`embed` → `object`)
- [x] Global link style added (was browser-default blue everywhere)
- [x] Pipeline node pulse: #2563eb → #06b6d4
- [x] CV section: light mode background de-blued
- [ ] Mobile: test buzzword toggle label visibility on small screens
- [ ] Mobile: pipeline SVG fallback on narrow viewports

## Copy Discussion

User to own all copy. Points to cover when we discuss:
- [ ] Hero: pre-title, typewriter phrases, subtitle — currently placeholder
- [ ] Card titles/bodies — 5 cards need real copy hitting the AI+devops+software angle
- [ ] Pipeline stage labels — currently generic CI/CD
- [ ] Section eyebrows and subs — need personality
- [ ] German translations — after English copy is final
- [ ] Buzzword mode expansions — silly graphs, whitepaper button
- [ ] Review the "I Orchestrate." / "Ich Orchestriere." titles — works but worth discussing

## Dark Mode (→ Design Log #011)

- [ ] Build a manual dark mode toggle (not system-coupled)
- [ ] Dark tokens: ink-blue surfaces instead of near-black (`#10171f` / `#17212d`)
- [ ] Cobalt and orange semantic roles preserved in both modes
- [ ] No glow in dark mode — surface contrast instead
- [ ] Reduce hero from `100vh` to `~82vh` so domain cards peek into viewport
- [ ] Fix SVG opacity compounding (group × child = invisible)
- [ ] Fix body font specificity (DM Sans losing to theme's Avenir utility class)
- [ ] Mobile nav spacing at 390px

## Tech

- [ ] Consider a "print stylesheet" that hides the buzzword button
