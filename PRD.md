# Product Requirements Document (PRD)

**Product:** Dating Profile Optimizer - Validation Landing Page
**Phase:** Pay-Intent Validation
**Status:** Draft
**Last Updated:** 2026-01-10

---

## 1. Overview

### 1.1 Purpose

A single-page landing site to validate willingness to pay for a Tinder profile optimization service. No payment is collected. The flow captures explicit pay-intent through honest commitment friction.

### 1.2 Goals

- [ ] Validate real willingness to pay $29 for profile optimization
- [ ] Test problem-solution fit and positioning
- [ ] Collect high-signal qualitative feedback from motivated users
- [ ] Gather email list of committed potential customers

### 1.3 Non-Goals

- Collecting actual payments
- Building the optimization product
- Supporting multiple dating apps
- Creating user accounts

### 1.4 Success Criteria

| Metric                     | Pass                        | Fail                    |
| -------------------------- | --------------------------- | ----------------------- |
| Pay-intent completion rate | ≥ 10-15%                    | < 5%                    |
| CTA click-through rate     | ≥ 1%                        | < 0.5%                  |
| Free-text response quality | Specific problems described | Generic/empty responses |

---

## 2. User Flow

```
Landing Page → CTA Click → Pay-Intent Modal → Commitment Form → Confirmation
```

### 2.1 Flow Diagram

```
┌─────────────────┐
│  Landing Page   │
│                 │
│  [Optimize my   │
│   profile $29]  │
└────────┬────────┘
         │ click
         ▼
┌─────────────────┐
│ Pay-Intent Modal│
│                 │
│ "Early access"  │
│                 │
│ [Yes, I intend  │
│  to pay $29]    │
│                 │
│ [No, not        │
│  interested]    │
└────────┬────────┘
         │ yes
         ▼
┌─────────────────┐
│ Commitment Form │
│                 │
│ Email: ________ │
│ ☐ I'm willing   │
│   to pay $29    │
│ What's not      │
│ working? ______ │
│                 │
│ [Submit]        │
└────────┬────────┘
         │ submit
         ▼
┌─────────────────┐
│  Confirmation   │
│                 │
│ "You're on the  │
│  early access   │
│  list..."       │
└─────────────────┘
```

---

## 3. Landing Page Requirements

### 3.1 Page Sections

#### Hero Section

- [ ] Headline: "Get more Tinder matches by fixing your profile — without changing who you are"
- [ ] Subheadline: "A one-off Tinder profile optimization for men who already look 'fine' but get inconsistent results."
- [ ] Primary CTA button: "Optimize my profile" with $29 price visible
- [ ] Micro-copy below CTA: "Takes 5 minutes · One-time payment · Results in 24–48h"

#### Problem Section

- [ ] Section headline: "Your profile isn't bad. It just doesn't convert."
- [ ] Bullet points:
  - [ ] "Some matches, but inconsistent"
  - [ ] "Unsure which photos help or hurt"
  - [ ] "Bio doesn't start conversations"
  - [ ] "Generic advice hasn't helped"

#### What You Get Section

- [ ] Section headline: "What You Get"
- [ ] Deliverables list:
  - [ ] Photo ranking (keep / replace / remove)
  - [ ] Best 3–4 photos selected
  - [ ] Rewritten bio
  - [ ] Improved prompts
  - [ ] Goal-based optimization

#### How It Works Section

- [ ] Section headline: "How It Works"
- [ ] 3-step process:
  - [ ] Step 1: "Upload your Tinder profile"
  - [ ] Step 2: "Choose your dating goal"
  - [ ] Step 3: "Receive optimization in 24–48h"

#### Pricing Section

- [ ] Display price prominently: "$29"
- [ ] Label: "One-time profile optimization"
- [ ] Secondary CTA button (same as hero)

### 3.2 Design Requirements

- [ ] Single-page layout (no navigation)
- [ ] Mobile-first responsive design
- [ ] Page load < 2 seconds on mobile
- [ ] Clean, minimal aesthetic
- [ ] High contrast CTA buttons
- [ ] No stock photos or fake testimonials

---

## 4. Pay-Intent Modal Requirements

### 4.1 Modal Trigger

- [ ] Opens on CTA button click
- [ ] Modal overlay (darkened background)
- [ ] Click outside or X button to close
- [ ] Prevent body scroll when open

### 4.2 Pay-Intent Screen (Step 1 of Modal)

**Content:**

- [ ] Headline: "Early access — payment not collected yet"
- [ ] Body text:
  - "One-off Tinder profile optimization"
  - "Price: $29"
  - "Delivery: ~3 weeks"
- [ ] Primary button: "Yes, I intend to pay $29"
- [ ] Secondary button: "No, not interested"

**Behavior:**

- [ ] "Yes" button → advance to Commitment Form
- [ ] "No" button → close modal, no data stored
- [ ] Track button clicks as analytics events

### 4.3 Commitment Form (Step 2 of Modal)

**Required Fields:**

- [ ] Email address input
  - [ ] Email format validation
  - [ ] Required field
- [ ] Checkbox: "I'm willing to pay $29 for a one-off Tinder profile optimization when available."
  - [ ] Required (must be checked to submit)
- [ ] Free-text textarea: "What's the main thing not working in your Tinder profile right now?"
  - [ ] Required field
  - [ ] Minimum 10 characters

**Submit Button:**

- [ ] Disabled until all fields valid
- [ ] Loading state during submission
- [ ] Error handling for failed submissions

### 4.4 Confirmation Screen (Step 3 of Modal)

**Content:**

- [ ] Headline: "You're on the list"
- [ ] Body: "You're on the early access list. If we move forward, you'll hear from us first. If not, nothing happens."
- [ ] Close button or auto-close after 5 seconds

---

## 5. Data Storage Requirements

### 5.1 Storage Solution

Use **SQLite** (file-based, zero cost, no external dependencies) or **Supabase free tier** if remote access needed.

### 5.2 Data Schema

**Lead**

```
- id (uuid or auto-increment)
- email (string, unique)
- willing_to_pay (boolean)
- price_shown (integer) -- $29
- main_problem (text)
- created_at (timestamp)
- source (string, nullable) -- utm_source
```

### 5.3 Data Requirements

- [x] Store email with deduplication (upsert on email)
- [x] Store checkbox confirmation value
- [x] Store free-text response
- [x] Store timestamp
- [x] Store UTM parameters if present
- [x] No PII beyond email

---

## 6. Analytics Requirements

### 6.1 Events to Track

| #   | Event Name    | Trigger                        | Priority |
| --- | ------------- | ------------------------------ | -------- |
| 1   | `page_view`   | Landing page loads             | Required |
| 2   | `cta_click`   | CTA button clicked             | Required |
| 3   | `intent_yes`  | "Yes, I intend to pay" clicked | Required |
| 4   | `intent_no`   | "No, not interested" clicked   | Required |
| 5   | `form_submit` | Commitment form submitted      | Required |
| 6   | `form_error`  | Form submission failed         | Optional |

### 6.2 Analytics Tool

- [x] PostHog (free tier sufficient)
- [x] Or simple custom event logging to database

### 6.3 Funnel Visualization

```
page_view → cta_click → intent_yes → form_submit
   100%        ?%          ?%           ?%
```

---

## 7. Technical Specifications

### 7.1 Tech Stack

| Component | Technology                             |
| --------- | -------------------------------------- |
| Framework | Next.js (App Router)                   |
| Styling   | Tailwind CSS                           |
| Database  | SQLite (local) or Supabase (free tier) |
| Analytics | PostHog                                |
| Hosting   | Vercel (free tier)                     |

### 7.2 Page Structure

```
/                   # Landing page
/api/leads          # POST endpoint for form submission
```

### 7.3 Dependencies

- [ ] Next.js 14+
- [ ] Tailwind CSS
- [ ] React Hook Form (form handling)
- [ ] Zod (validation)
- [ ] PostHog JS SDK (optional)

---

## 8. Implementation Tasks

### Phase 1: Project Setup

- [ ] Initialize Next.js project with Tailwind
- [ ] Set up project structure
- [ ] Configure environment variables
- [ ] Set up SQLite or Supabase connection

### Phase 2: Landing Page

- [ ] Create page layout component
- [ ] Build Hero section with CTA
- [ ] Build Problem section
- [ ] Build What You Get section
- [ ] Build How It Works section
- [ ] Build Pricing section
- [ ] Add responsive styles
- [ ] Test on mobile devices

### Phase 3: Modal Component

- [ ] Create modal wrapper component
- [ ] Build Pay-Intent screen
- [ ] Build Commitment Form screen
- [ ] Build Confirmation screen
- [ ] Add step transitions/animations
- [ ] Handle modal open/close states
- [ ] Prevent body scroll when open

### Phase 4: Form & Data

- [x] Create form with validation
- [x] Build API route for lead submission
- [x] Implement email deduplication
- [x] Add error handling
- [x] Test form submission flow

### Phase 5: Analytics

- [x] Install PostHog or custom tracking
- [x] Add page view tracking
- [x] Add CTA click tracking
- [x] Add intent button tracking
- [x] Add form submission tracking
- [x] Verify events in dashboard

### Phase 6: Deploy & Test

- [ ] Deploy to Vercel
- [ ] Configure custom domain (if available)
- [ ] End-to-end flow testing
- [ ] Mobile testing
- [ ] Performance audit (Lighthouse)

---

## 9. Non-Negotiables

Per modal_requirements.pdf:

- [ ] **No fake UI** — No fake payment forms or Stripe-like interfaces
- [ ] **No discounts** — Price is $29, no promotional pricing
- [ ] **No "waitlist" language** — Use "early access" instead
- [ ] **No extra steps** — Keep flow minimal (3 steps max in modal)
- [ ] **Transparent messaging** — Always clear that payment isn't collected yet

---

## 10. Copy Reference

### Hero

> **Get more Tinder matches by fixing your profile — without changing who you are**
>
> A one-off Tinder profile optimization for men who already look "fine" but get inconsistent results.

### Pay-Intent Modal

> **Early access — payment not collected yet**
>
> - One-off Tinder profile optimization
> - Price: $29
> - Delivery: ~3 weeks

### Commitment Checkbox

> I'm willing to pay $29 for a one-off Tinder profile optimization when available.

### Free-text Prompt

> What's the main thing not working in your Tinder profile right now?

### Confirmation

> You're on the early access list. If we move forward, you'll hear from us first. If not, nothing happens.

---

## 11. Open Questions

| Question                            | Status |
| ----------------------------------- | ------ |
| Custom domain name?                 | TBD    |
| Privacy policy / terms needed?      | TBD    |
| GDPR compliance for EU traffic?     | TBD    |
| Follow-up email to confirmed leads? | TBD    |

---

## 12. Risks

| Risk                                | Mitigation                              |
| ----------------------------------- | --------------------------------------- |
| Low traffic volume                  | Plan paid ads (Meta) after organic test |
| Bot submissions                     | Add honeypot field or rate limiting     |
| Users confused about "early access" | Clear copy that no payment collected    |
| Free-text answers too short         | Minimum character requirement           |
