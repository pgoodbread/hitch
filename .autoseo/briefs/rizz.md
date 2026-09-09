# Brief: rizz

- Target keyword: `rizz`
- Lane: new
- Destination: src/content/blog (renders under /blog)
- Search intent: informational
- Funnel position: top
- Volume: 78000/mo · KD: 0
- Target length: 1200–1800 words
- Post type: guide

## Angle (important — avoid cannibalising an existing page)

The site already ranks a lines listicle at `/blog/best-rizz-lines`. This article
must NOT be a second list of lines. It is the definitional/explainer page for the
term itself — what rizz means, where it came from, what "W rizz" / "L rizz" /
"unspoken rizz" mean, and what actually reads as rizz on a dating profile versus
what reads as trying too hard. Send readers who want the actual openers to
`/blog/best-rizz-lines` with a clear internal link.

Structurally this should feel like `/blog/swipe-left-meaning`: answer the
definition fast and plainly in the opening, then spend the back half on the
useful question — how a guy actually builds rizz into his profile and opening
messages.

## Competitor coverage

- https://web.rizz.app/

## Internal-link candidates (up to 6)

- /blog/best-rizz-lines — the natural next click for anyone who came for the definition and wants actual lines to use
- /blog/ask-girl-out-tinder — rizz has to convert into an actual ask; this is the follow-through step
- /blog/best-tinder-bios-for-guys — bio is where written rizz lives on a profile
- /blog/profile-pictures — "unspoken rizz" is largely photo presence; ties the slang to something actionable
- /blog/swipe-left-meaning — sibling basics/slang explainer, same reader at the same stage
- /blog/dating-me-is-like — prompt answers are a concrete place to show personality rather than assert it

## Title & metadata (the site renders frontmatter `title` as the H1 and as the <title> tag)

- `title` must contain `rizz` (exact, or its natural singular/plural), ideally within the first 30 characters.
- Keep `title` ≤ 44 characters so the site can append its brand suffix; hard maximum 60.
- If the best human-readable headline cannot carry the keyword, keep it as `title` and add a keyword-first `seoTitle` (≤ 60 chars) — the site uses `seoTitle` for the <title> tag and keeps `title` as the on-page H1.
- `description` must contain `rizz` and stay ≤ 155 characters.
- Use `rizz` in the first 100 words and in at least one `##` heading.
- Never write a `# ` heading in the body — the page would get two H1s.

## Frontmatter shape (match existing files in src/content/blog)

```
---
title: '...'
date: '2026-09-09'
description: '...'
tags: ['basics', 'tinder']
author: 'Mathew'
---
```
