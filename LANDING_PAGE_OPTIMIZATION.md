# Landing Page Optimization Plan

## Current State Analysis

**Product**: Hitch - Tinder Profile Optimization Service ($29 one-time)
**Tech Stack**: Next.js 15, Tailwind CSS, Headless UI, SQLite

### Current Page Structure

1. Header with navigation
2. Hero (headline + single CTA)
3. Pain Points (tabbed interface)
4. Deliverables (5 features with checkmarks)
5. How It Works (3 steps)
6. Trust Section ("What this isn't")
7. Pricing ($29 card)
8. FAQ (3 questions)
9. Footer

---

## Gap Analysis vs 2025 Best Practices

| Area                 | Current State             | Best Practice                      | Priority |
| -------------------- | ------------------------- | ---------------------------------- | -------- |
| **Social Proof**     | None above fold           | Testimonials + logos = 19-34% lift | HIGH     |
| **Above-the-Fold**   | Headline + 1 CTA only     | Value prop + social proof + CTA    | HIGH     |
| **Navigation**       | Full nav bar shown        | No nav = 28% conversion lift       | MEDIUM   |
| **CTA Placement**    | Hero + Pricing only       | Above fold, mid-page, bottom       | MEDIUM   |
| **Video Content**    | None                      | 86% increase in time on page       | MEDIUM   |
| **Form Strategy**    | 3-step modal              | Minimal fields, progressive        | LOW      |
| **Urgency/Scarcity** | "Limited spots" text only | Concrete urgency signals           | LOW      |
| **Trust Badges**     | None                      | Security/guarantee badges          | MEDIUM   |
| **FAQ Count**        | 3 questions               | 5-8 for common objections          | LOW      |

---

## Recommended Optimizations

### Phase 1: High-Impact Quick Wins (Hero Section)

#### 1.1 Add Social Proof Above the Fold

**File**: `src/components/Hero.tsx`

Since no testimonials exist yet, use alternative social proof:

- Waitlist/signup count from database (e.g., "Join 50+ men on the waitlist")
- Process credibility (e.g., "Based on 1000+ profile reviews")
- Expertise signal (e.g., "From a dating profile expert")

Implementation: Query lead count from SQLite and display dynamically

#### 1.2 Add Secondary CTA

**File**: `src/components/Hero.tsx`

Add a secondary lower-commitment CTA:

- Primary: "Optimize my profile" (keep)
- Secondary: "See how it works" (anchor link to #how-it-works)

#### 1.3 Remove Navigation on Landing Page (A/B test candidate)

**File**: `src/components/Header.tsx`

Research shows removing nav increases conversions by up to 28%. Options:

- A: Remove nav links, keep logo only
- B: Make nav sticky but minimal
- C: Hide nav until scroll

---

### Phase 2: Trust & Social Proof Section

#### 2.1 Replace Testimonials with "How It Helps" Social Proof

**File**: `src/components/Testimonials.tsx` (rename/repurpose)

Since no testimonials exist yet, replace with credibility signals:

- "Why This Works" section with data-backed claims
- Statistics about common profile mistakes (e.g., "87% of profiles have photo ordering issues")
- Before/after concept illustrations (not real customer data)

#### 2.2 Add Trust Badges to Pricing

**File**: `src/components/Pricing.tsx`

Add below the CTA button (no money-back guarantee available):

- "Your data is never stored" with lock icon
- "24-48h delivery guaranteed" with clock icon
- "One-time payment - no subscription" badge

---

### Phase 3: CTA Strategy Improvements

#### 3.1 Add Mid-Page CTA

**File**: `src/components/SecondaryFeatures.tsx`

Add CTA button after the deliverables list:

- "Ready to get started? → Optimize my profile"

#### 3.2 Add Sticky Mobile CTA

**File**: `src/components/StickyCTA.tsx` (new)

Create a sticky bottom CTA bar for mobile:

- Only appears after scrolling past hero
- Shows price + "Optimize Now" button
- Disappears when pricing section is in view

#### 3.3 Improve CTA Copy (A/B test candidates)

Current: "Optimize my profile"

Test variants:

- "Get my profile reviewed" (lower commitment)
- "See my profile score" (curiosity)
- "Start my optimization" (action-oriented)

---

### Phase 4: Content Enhancements

#### 4.1 Expand FAQ Section

**File**: `src/components/Faqs.tsx`

Add 3-4 more FAQs addressing common objections:

- "Do I need professional photos?" (→ no, we work with what you have)
- "Does this work for Bumble/Hinge?" (→ yes, principles transfer)
- "What makes this different from free advice?" (→ personalized, specific to your profile)
- "Can I see an example?" (→ describe the deliverable format)

#### 4.2 Add "Results" or "Outcomes" Section

**New File**: `src/components/Results.tsx`

Between deliverables and pricing, add:

- Specific outcome statements
- Visual representation of improvement
- "Most users see improvement within the first week"

---

### Phase 5: Technical & UX Improvements

#### 5.1 Page Speed Audit

**Files**: Various image files

- Audit image sizes (background-features.jpg, background-faqs.jpg)
- Add `priority` to above-fold images
- Consider lazy loading for below-fold images

#### 5.2 Mobile Optimization Review

**All component files**

- Ensure CTA buttons are thumb-friendly (min 44px tap target)
- Review text sizes on mobile
- Test form modal on mobile devices

---

## Implementation Order (Full)

| Step | Task                                          | File(s)                   |
| ---- | --------------------------------------------- | ------------------------- |
| 1    | Add social proof counter to hero              | `Hero.tsx`, new API route |
| 2    | Add secondary CTA to hero                     | `Hero.tsx`                |
| 3    | Reduce/remove navigation                      | `Header.tsx`              |
| 4    | Add trust badges to pricing                   | `Pricing.tsx`             |
| 5    | Repurpose testimonials as credibility section | `Testimonials.tsx`        |
| 6    | Add mid-page CTA after deliverables           | `SecondaryFeatures.tsx`   |
| 7    | Create sticky mobile CTA                      | New `StickyCTA.tsx`       |
| 8    | Expand FAQ section                            | `Faqs.tsx`                |
| 9    | Improve CTA copy                              | Multiple files            |
| 10   | Image optimization audit                      | Various                   |

---

## Files to Modify

1. `src/components/Hero.tsx` - Social proof, secondary CTA
2. `src/components/Header.tsx` - Navigation reduction
3. `src/components/Pricing.tsx` - Trust badges
4. `src/components/SecondaryFeatures.tsx` - Mid-page CTA
5. `src/components/Faqs.tsx` - Expand questions
6. `src/components/Testimonials.tsx` - Repurpose as credibility section
7. `src/components/StickyCTA.tsx` (new) - Mobile sticky CTA

---

## Verification Plan

1. **Visual Review**: Start dev server, inspect each change on desktop and mobile
2. **Lighthouse Audit**: Run performance check before/after
3. **Analytics Events**: Verify new CTAs trigger `cta_click` events
4. **Mobile Testing**: Test form modal and sticky CTA on mobile viewport
5. **A/B Test Setup**: Document variants for future testing

---

## Context

- **Testimonials**: None yet (pre-launch) → Using alternative social proof
- **Guarantee**: No money-back guarantee → Trust badges focus on privacy + delivery

---

## Sources

- [Unbounce Landing Page Best Practices](https://unbounce.com/landing-page-articles/landing-page-best-practices/)
- [involve.me Landing Page Best Practices 2025](https://www.involve.me/blog/landing-page-best-practices)
- [Shopify High-Converting Landing Pages](https://www.shopify.com/blog/high-converting-landing-pages)
- [Unbounce SaaS Landing Page Examples](https://unbounce.com/conversion-rate-optimization/the-state-of-saas-landing-pages/)
- [KlientBoost SaaS Landing Pages](https://www.klientboost.com/landing-pages/saas-landing-page/)
- [MagicUI SaaS Landing Page Best Practices 2025](https://magicui.design/blog/saas-landing-page-best-practices)
