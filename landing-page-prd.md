# PRD: Landing Page Redesign for Free Score Funnel

## Summary

Redesign the landing page at tinderprofileoptimizer.com to drive visitors toward the free profile score at `/score`, which then upsells to the paid $29 full analysis. The current LP sells the paid product directly — this change adds a free entry point to the funnel.

---

## Problem

- Current LP sends visitors straight to a $29 paywall
- Zero trust has been built — visitors don't know if the product works
- No email capture for visitors who aren't ready to pay
- No free taste of the product to demonstrate value

## Goal

- Primary CTA becomes "Get Your Free Profile Score" → `/score`
- Secondary CTA remains "Get Full Analysis — $29" → `/optimize`
- Capture more emails via the free funnel
- Increase overall paid conversions by warming users up with the free score first

---

## New Page Structure

### Above the Fold

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [Nav: Logo — "Swipeworthy" or current branding] │
│                                                  │
│  HEADLINE:                                       │
│  "Not Getting Matches?                           │
│   Your Profile Is the Problem."                  │
│                                                  │
│  SUBHEAD:                                        │
│  "AI analyzes your Tinder profile in 30 seconds  │
│   and tells you exactly what's killing your       │
│   swipes."                                       │
│                                                  │
│  [====== Get Your Free Profile Score ======]     │
│              (primary CTA → /score)              │
│                                                  │
│  "Takes 30 seconds. No credit card required."    │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Requirements:**

- Headline: Large, bold, immediately addresses the pain point
- Subhead: One sentence explaining what the tool does
- Primary CTA button: High contrast, full width on mobile, links to `/score`
- Trust line below button: "Takes 30 seconds. No credit card required."
- No other links or distractions above the fold — one action only

### Section 2: How It Works

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  HOW IT WORKS                                    │
│                                                  │
│  1. Upload your photos + bio                     │
│     "Drop in 1-3 Tinder screenshots"             │
│                                                  │
│  2. AI analyzes your profile                     │
│     "Scores your photos, bio, and first           │
│      impression in 30 seconds"                   │
│                                                  │
│  3. Get your score                               │
│     "See where you stand + what's holding         │
│      you back"                                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Requirements:**

- 3 steps, icon or number for each
- Keep it short — one line title + one line description per step
- Describes the FREE flow, not the paid flow
- No mention of payment in this section

### Section 3: Example Score (Social Proof for the Free Tool)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  WHAT YOU'LL GET                                 │
│                                                  │
│  [Mock score result card]                        │
│                                                  │
│  Your Tinder Profile Score: 4.2 / 10            │
│  ┌────────────────────────────────┐              │
│  │ Photos:           5.1 / 10    │              │
│  │ Bio:              3.4 / 10    │              │
│  │ First Impression: 4.2 / 10    │              │
│  └────────────────────────────────┘              │
│                                                  │
│  "Your lead photo is the weakest in your lineup" │
│                                                  │
│  [====== Check Your Score Free ======]           │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Requirements:**

- Show a realistic example of what the free score output looks like
- Use a fictional but believable score (4-5 range — bad enough to be motivating)
- Include one teaser line to show the AI is specific, not generic
- Second CTA button below → `/score`

### Section 4: What's In the Full Analysis (Sells the Paid Product)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  WANT THE FULL FIX?                              │
│                                                  │
│  Your free score shows the problem.              │
│  The full analysis gives you the solution.       │
│                                                  │
│  ✓ Photo-by-photo verdict (keep / remove /       │
│    replace)                                      │
│  ✓ Optimal photo order for maximum swipes        │
│  ✓ Rewritten bio ready to copy-paste             │
│  ✓ Conversation starters from Tinder's prompt    │
│    list                                          │
│  ✓ Personal action plan — exactly what to fix    │
│    first                                         │
│                                                  │
│  [====== Get Full Analysis — $29 ======]         │
│              (secondary CTA → /optimize)         │
│                                                  │
│  "Most users see more matches within a week."    │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Requirements:**

- Position this as the upgrade from the free score
- Checklist of what's included (5 items max)
- Secondary CTA → `/optimize`
- This section is below the fold — most visitors should hit the free score first
- Add social proof line if/when testimonials exist

### Section 5: Testimonials (Empty State for Now)

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  WHAT USERS SAY                                  │
│                                                  │
│  [Placeholder — add testimonials as they         │
│   come in from paid customers]                   │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Requirements:**

- Don't show this section until you have at least 2-3 real testimonials
- Hide completely for launch — an empty testimonials section hurts more than it helps
- When added: short quote + first name + result ("went from 2 matches/week to 15")

### Section 6: FAQ

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  FAQ                                             │
│                                                  │
│  "Is the free score actually free?"              │
│  Yes. No credit card, no catch. Upload your      │
│  photos and bio, get your score in 30 seconds.   │
│                                                  │
│  "What do I need to upload?"                     │
│  1-3 screenshots of your Tinder profile photos   │
│  + your bio text. That's it.                     │
│                                                  │
│  "Is my data safe?"                              │
│  Your photos are deleted immediately after        │
│  analysis. We don't store them.                  │
│                                                  │
│  "What's in the paid analysis?"                  │
│  A full report: photo-by-photo verdicts,         │
│  rewritten bio, conversation prompts, and a      │
│  step-by-step action plan. Delivered to your     │
│  email.                                          │
│                                                  │
│  "Does this work for Hinge / Bumble?"            │
│  Right now it's optimized for Tinder only.       │
│  Other apps coming soon.                         │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Requirements:**

- 4-5 questions max
- Address the main objections: is it really free, is it safe, what do I get
- Keep answers to 1-2 sentences each
- Collapsible accordion on mobile

### Footer

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [====== Get Your Free Profile Score ======]     │
│                                                  │
│  Final CTA — same as hero                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Requirements:**

- Repeat the primary free score CTA at the bottom
- Nothing else in the footer for now (no blog, no about, no social links cluttering things up)

---

## CTA Hierarchy

| Priority  | CTA                           | Destination | Where It Appears                  |
| --------- | ----------------------------- | ----------- | --------------------------------- |
| Primary   | "Get Your Free Profile Score" | `/score`    | Hero, after example score, footer |
| Secondary | "Get Full Analysis — $29"     | `/optimize` | Section 4 only                    |

The page should have 3 primary CTAs and 1 secondary CTA. Nothing else competes for attention.

---

## Copy Guidelines

- Tone: Bold, direct, slightly provocative. Not corporate. Not cringe.
- Address the reader as "you" — never "users" or "our customers"
- Keep sentences short. No paragraph longer than 2 lines.
- Every section should make the visitor either scroll down or click the CTA. If it doesn't do one of those two things, cut it.
- No jargon: say "AI" not "machine learning model." Say "score" not "analysis metrics."
- No fake urgency: no countdown timers, no "only 5 spots left" nonsense

---

## Mobile Requirements

- Primary CTA button is full-width and sticky on mobile (fixed to bottom of screen)
- Hero section fits in one mobile viewport — no scrolling to see the CTA
- Example score card is responsive — stacks vertically on small screens
- FAQ is accordion-style (collapsed by default)
- Page loads fast — no heavy images above the fold, no animations that block interaction
- Total page weight under 500KB

---

## What to Remove from Current LP

- Any direct link to `/optimize` as the primary action — it should only appear in Section 4
- Feature lists that describe the paid product above the fold
- Any pricing mentioned before the user sees the free score option
- Anything that makes the page feel like a sales page before the user has experienced the free tool
- Social links, blog links, about pages — remove all distractions for now

---

## What NOT to Build

- Don't add animations or transitions — ship fast
- Don't add a chatbot or live chat
- Don't build an about page or blog
- Don't add multiple pricing tiers
- Don't A/B test yet — you need traffic first, optimization later

---

## Technical Notes

- This is a single-page redesign, not a new site
- No new backend work — just HTML/CSS/copy changes
- `/score` and `/optimize` already exist, just need to be linked correctly
- Linktree or bio link should update to point to the homepage (which now funnels to `/score`)
- Add UTM params to CTAs so you can track which section drives the most clicks: `/score?utm_source=lp&utm_content=hero` vs `utm_content=example` vs `utm_content=footer`

---

## Success Metrics

| Metric                          | Current (est.)      | Target                    |
| ------------------------------- | ------------------- | ------------------------- |
| Homepage → /score click rate    | 0% (no link exists) | 30-40%                    |
| Homepage → /optimize click rate | Unknown             | 5-10% (from Section 4)    |
| Overall homepage bounce rate    | Unknown             | Under 60%                 |
| Free scores completed / week    | 0                   | 50+ (once traffic starts) |

---

## Launch Checklist

- [ ] Hero section updated with new headline + free score CTA
- [ ] "How It Works" section added (3 steps)
- [ ] Example score card section added
- [ ] "Full Analysis" section with paid CTA added
- [ ] FAQ section added
- [ ] Testimonials section hidden (show when available)
- [ ] Footer CTA added
- [ ] Old direct-to-paid CTAs removed or deprioritized
- [ ] Mobile tested — CTA visible without scrolling
- [ ] Bio links updated on TikTok + IG to homepage
- [ ] UTM params added to all CTAs
- [ ] Full flow tested: homepage → /score → results → /optimize checkout
