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

## Visual Polish

- [ ] Particle colors/style tweaks
- [ ] Card icon refinements (current SVGs are placeholder)
- [ ] Pipeline SVG could be more elaborate (branching paths for prod/beta?)
- [ ] Mobile responsiveness testing
- [ ] Scroll hint animation polish
- [ ] Card shimmer speed/vibrancy tuning

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
- [ ] Audit remaining hardcoded blues/purples across the stylesheet
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

## Tech

- [ ] Consider a "print stylesheet" that hides the buzzword button
