# Project Config: Padilla's Construction Website Improved

> The Stable Ground Truth (Bedrock). This file defines the unchangeable
> foundation of the project. Agents must read it before every change and
> must never modify code in ways that violate it.

## 1. Core Objective

- Create an improved version of https://padillas-ws.onrender.com for Padilla's Construction, preserving the masonry business content while improving conversion, visual polish, responsiveness, and trust signals.

## 2. Tech Stack & Dependencies

- Frontend: Static HTML, CSS, and vanilla JavaScript. No framework required.
- Backend: None.
- Databases: None.

## 3. Strict Architectural Rules

- Build as a deployable static marketing website with semantic HTML, accessible navigation, responsive layout, and no build step.
- Maintain absolute type safety with strict TypeScript compilation (if TypeScript is used).
- Preserve Padilla's Construction business content from the reference site: premium residential masonry, stone veneer, chimneys, brick repair, retaining walls, tuckpointing, restoration, Chicago service area, phone CTA, email CTA, 4.7 rating / 18 Google reviews proof.
- Improve conversion with clear above-the-fold value proposition, prominent estimate/call CTAs, service cards, trust metrics, process section, project-quality proof, testimonials, service area, and a complete contact section.
- Use real masonry/construction photography from stable remote URLs when appropriate; avoid purely decorative SVG hero art.
- Avoid broken internal navigation: for a one-page site, use anchored section links instead of missing route pages.
- Design Patterns: One-page contractor landing page, semantic sections, responsive CSS grid/flex layouts, progressive enhancement with small JavaScript for menu and scroll behavior.

## 4. Global Developer Profile (injected at init)

> ================================================================================
> GLOBAL DEVELOPER PROFILE (Persistent Cross-Project Brain)
> Maintained by: OpenClaw Orchestrator
> Updated: at the end of every completed build cycle
> ================================================================================
> 
> Purpose: This file accumulates structural characteristics learned across all
> projects built by the AutomationSystem pipeline. Its contents are injected into
> each new project's project_config.md at initialization time.
> 
> ## Architectural Biases
> (preferred folder setups, custom hooks patterns, framework preferences)
> - (none recorded yet)
> - Favor single-file static landing pages for simple proof-of-life builds, with semantic HTML and a separate CSS file when styling is non-trivial.
> - For premium contractor landing pages, static HTML/CSS/JS can ship quickly with remote photography, a sticky glass header, trust-strip proof, service cards, and a map-style local service area.
> 
> ## Code Complexity Style
> (verbose vs. hyper-minimalist approaches, commenting habits, naming conventions)
> - (none recorded yet)
> - Keep implementation compact and readable; prefer explicit structure over abstraction for one-page sites.
> 
> ## Recurring Error Profiles & Automated Solutions
> (frequently repeated error patterns and the fixes that resolved them)
> - (none recorded yet)
> - Telegram channel ack/completion delivery can fail if no peer target is discoverable; verify the recipient directory before sending.
> - Playwright CLI may lack the exact browser cache; a cached Chromium headless shell can still produce screenshot QA from the local dev server.
> 
> ## Build Cycle History
> (one line per completed project: date, slug, stack, outcome, total token spend)
> - 2026-07-10 | pipeline-test-page | static HTML/CSS | pass | approx. 9k tokens
> - 2026-07-10 | stonecraft-masonry-landing-page | static HTML/CSS/JS | pass + Render live | approx. 20k tokens
> - 2026-07-10 | stonecraft-masonry-landing-page-rebuild | static HTML/CSS/JS | pass + Render live | approx. 12k tokens
