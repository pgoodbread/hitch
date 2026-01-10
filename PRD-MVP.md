# Product Requirements Document (PRD)

**Product:** Dating Profile Optimizer
**Version:** MVP
**Status:** Draft
**Last Updated:** 2026-01-10

---

## 1. Overview

### 1.1 Product Summary

A one-time AI-powered dating profile optimizer for men using Tinder. Users upload their current profile (screenshots or manual entry) and receive structured feedback and rewritten suggestions via email within 1 hour.

The product focuses on the three elements that most strongly affect match rates:

- **Photo selection** - which photos to keep, remove, or reorder
- **Profile text (bio)** - rewritten to be clearer and more engaging
- **Prompts** - improved answers that create conversation opportunities

### 1.2 Problem Statement

Men with otherwise acceptable Tinder profiles experience low or inconsistent match rates and do not know what specifically is wrong. Existing advice is generic, conflicting, or requires ongoing coaching, which this audience does not want.

### 1.3 Goals

- [ ] Deliver actionable, personalized profile feedback via AI automation
- [ ] Achieve < 1 hour turnaround from submission to email delivery
- [ ] Provide concrete rewrites, not just abstract advice
- [ ] Generate revenue at $29 per optimization

### 1.4 Non-Goals

- Building ongoing coaching or subscription features
- Supporting dating apps other than Tinder (MVP scope)
- Creating fake personas or manipulative pickup content
- User accounts or dashboards
- Mobile app development

---

## 2. User Persona

### 2.1 Primary User

**Urban Professional Tinder User**

| Attribute    | Description                                              |
| ------------ | -------------------------------------------------------- |
| Demographics | Men, 25-35, lives in large cities                        |
| Employment   | Employed with disposable income (tech, STEM, consulting) |
| Behavior     | Active Tinder user with inconsistent match results       |
| Preference   | Structured, practical feedback over generic advice       |
| Budget       | Willing to pay $20-50 for a one-time solution            |

### 2.2 Excluded Users

- Teenagers or students without disposable income
- Users seeking pickup lines or manipulation tactics
- Users expecting ongoing coaching or live support
- Women (out of scope for MVP positioning)

---

## 3. User Journey

```
Ad/Organic → Landing Page → Payment ($29) → Profile Submission → AI Processing → Email Delivery
```

### 3.1 Detailed Flow

1. **Discovery** - User sees ad or finds product organically
2. **Landing Page** - User understands value proposition and pricing
3. **Payment** - User pays $29 (Stripe checkout)
4. **Submission Form** - User uploads screenshots and/or enters profile text
5. **Processing** - AI analyzes profile (target: < 30 min)
6. **Delivery** - User receives formatted feedback email
7. **Follow-up** - Optional: satisfaction survey after 7 days

---

## 4. Functional Requirements

### 4.1 Landing Page

- [ ] Outcome-focused headline communicating the benefit
- [ ] Problem framing section addressing user pain points
- [ ] Clear explanation of what user receives
- [ ] "How it works" section (3 steps max)
- [ ] Social proof / trust elements
- [ ] Single primary CTA with $29 price displayed
- [ ] FAQ section addressing common objections
- [ ] Mobile-responsive design

### 4.2 Payment Flow

- [ ] Stripe Checkout integration
- [ ] $29 one-time payment
- [ ] Email collection during checkout
- [ ] Success redirect to submission form
- [ ] Failed payment error handling
- [ ] Receipt email sent automatically

### 4.3 Profile Submission Form

- [ ] Screenshot upload (multiple images, max 9)
  - [ ] Supported formats: JPG, PNG, HEIC
  - [ ] Max file size: 10MB per image
  - [ ] Image preview before submission
- [ ] Manual text entry fields
  - [ ] Bio text (optional if screenshots provided)
  - [ ] Prompt answers (optional)
- [ ] Validation: require at least 1 screenshot OR bio text
- [ ] Unique submission link (no account required)
- [ ] Submission confirmation message
- [ ] Prevent duplicate submissions from same purchase

### 4.4 AI Analysis Engine

- [ ] Photo analysis capabilities
  - [ ] Detect number of photos
  - [ ] Identify photo quality issues (blurry, dark, etc.)
  - [ ] Detect group photos vs solo photos
  - [ ] Identify photo variety (activities, settings)
  - [ ] Generate ordering recommendations
- [ ] Bio analysis capabilities
  - [ ] Assess length and readability
  - [ ] Identify common weak patterns
  - [ ] Generate rewritten alternatives (2-3 options)
- [ ] Prompt analysis capabilities
  - [ ] Evaluate conversation potential
  - [ ] Identify generic/overused answers
  - [ ] Generate improved alternatives
- [ ] Processing time target: < 30 minutes
- [ ] Error handling for failed analysis
- [ ] Queue management for concurrent submissions

### 4.5 Email Delivery

- [ ] Transactional email service integration (Resend, SendGrid, or similar)
- [ ] Formatted HTML email template
- [ ] Email sections:
  - [ ] Summary score or overview
  - [ ] Photo feedback with specific recommendations
  - [ ] Original bio vs rewritten options
  - [ ] Original prompts vs improved alternatives
  - [ ] Quick-win action items
- [ ] Plain text fallback
- [ ] Delivery confirmation tracking
- [ ] Retry logic for failed sends
- [ ] Target delivery: within 1 hour of submission

### 4.6 Analytics & Tracking

- [ ] Landing page view tracking
- [ ] Payment initiated / completed events
- [ ] Submission form view / completion events
- [ ] Email delivery / open tracking
- [ ] Conversion funnel visualization
- [ ] Revenue tracking

---

## 5. Technical Requirements

### 5.1 Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│  AI Service │
│  (Next.js)  │     │  (API/DB)   │     │  (OpenAI)   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Email     │
                    │  (Resend)   │
                    └─────────────┘
```

### 5.2 Tech Stack

| Component    | Technology                                  |
| ------------ | ------------------------------------------- |
| Frontend     | Next.js (App Router)                        |
| Styling      | Tailwind CSS                                |
| Backend      | Next.js API Routes or separate Node service |
| Database     | PostgreSQL (Supabase) or SQLite             |
| File Storage | Cloudflare R2 or AWS S3                     |
| Payments     | Stripe Checkout                             |
| AI           | OpenAI GPT-4 Vision API                     |
| Email        | Resend or SendGrid                          |
| Analytics    | PostHog                                     |
| Hosting      | Vercel                                      |

### 5.3 Infrastructure Requirements

- [ ] Domain and SSL certificate
- [ ] Stripe account with live keys
- [ ] OpenAI API access with sufficient quota
- [ ] Email service account with verified domain
- [ ] File storage bucket for image uploads
- [ ] Database provisioned
- [ ] PostHog project created
- [ ] Environment variables configured

### 5.4 Performance Requirements

- [ ] Landing page load < 2 seconds (mobile)
- [ ] Image upload with progress indicator
- [ ] AI processing < 30 minutes (p95)
- [ ] Email delivery < 1 hour from submission (p95)
- [ ] 99.9% uptime for payment flow

### 5.5 Security Requirements

- [ ] HTTPS everywhere
- [ ] Stripe handles all payment data (PCI compliant)
- [ ] Uploaded images stored securely, deleted after 30 days
- [ ] No passwords (unique links only)
- [ ] Rate limiting on API endpoints
- [ ] Input sanitization

---

## 6. Data Model

### 6.1 Core Entities

**Purchase**

```
- id (uuid)
- email (string)
- stripe_payment_id (string)
- amount_cents (integer)
- status (pending | completed | refunded)
- created_at (timestamp)
```

**Submission**

```
- id (uuid)
- purchase_id (uuid, FK)
- access_token (string, unique)
- status (pending | processing | completed | failed)
- submitted_at (timestamp)
- processed_at (timestamp)
```

**UploadedImage**

```
- id (uuid)
- submission_id (uuid, FK)
- storage_url (string)
- order (integer)
- created_at (timestamp)
```

**ProfileContent**

```
- id (uuid)
- submission_id (uuid, FK)
- bio_text (text, nullable)
- prompts (jsonb, nullable)
```

**AnalysisResult**

```
- id (uuid)
- submission_id (uuid, FK)
- photo_feedback (jsonb)
- bio_feedback (jsonb)
- prompt_feedback (jsonb)
- summary (text)
- created_at (timestamp)
```

---

## 7. Email Template Structure

### 7.1 Sections

1. **Header**
   - Product logo
   - "Your Tinder Profile Analysis"

2. **Summary**
   - Overall assessment (2-3 sentences)
   - Top 3 quick wins

3. **Photo Feedback**
   - Current photo assessment
   - Specific issues identified
   - Recommended order
   - Photos to remove/replace

4. **Bio Feedback**
   - Original bio (quoted)
   - Issues identified
   - Rewritten option 1 (recommended)
   - Rewritten option 2 (alternative)

5. **Prompt Feedback** (if applicable)
   - Original prompt + answer
   - Issues identified
   - Improved version

6. **Next Steps**
   - Prioritized action checklist
   - Optional: link to satisfaction survey

7. **Footer**
   - Support email
   - Unsubscribe (for any follow-up emails)

---

## 8. Success Metrics

### 8.1 Primary KPIs

| Metric                             | Target   | Measurement         |
| ---------------------------------- | -------- | ------------------- |
| Conversion Rate (visit → purchase) | > 2%     | PostHog funnel      |
| Submission Completion Rate         | > 90%    | Database            |
| Email Delivery Rate                | > 99%    | Email service       |
| Processing Time (p95)              | < 30 min | Database timestamps |
| Customer Satisfaction              | > 4/5    | Follow-up survey    |

### 8.2 Revenue Metrics

| Metric               | Target            |
| -------------------- | ----------------- |
| Revenue per week     | $500+ (17+ sales) |
| Refund rate          | < 5%              |
| Cost per acquisition | < $10             |

---

## 9. Implementation Phases

### Phase 1: Foundation

- [ ] Set up Next.js project with Tailwind
- [ ] Configure Stripe test mode
- [ ] Set up database schema
- [ ] Configure file storage
- [ ] Set up email service

### Phase 2: Landing Page

- [ ] Build landing page with copy
- [ ] Implement Stripe Checkout flow
- [ ] Add payment success/failure handling
- [ ] Set up analytics tracking

### Phase 3: Submission Flow

- [ ] Build submission form UI
- [ ] Implement image upload with preview
- [ ] Add text input fields
- [ ] Create unique access token system
- [ ] Build submission confirmation page

### Phase 4: AI Processing

- [ ] Integrate OpenAI Vision API
- [ ] Build photo analysis prompts
- [ ] Build bio analysis prompts
- [ ] Build prompt analysis logic
- [ ] Implement job queue for processing
- [ ] Add error handling and retries

### Phase 5: Email Delivery

- [ ] Design HTML email template
- [ ] Integrate email service
- [ ] Implement delivery logic
- [ ] Add delivery tracking
- [ ] Test across email clients

### Phase 6: Polish & Launch

- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Switch Stripe to live mode
- [ ] DNS and domain setup
- [ ] Launch monitoring and alerts

---

## 10. Open Questions

| Question                   | Options                            | Decision |
| -------------------------- | ---------------------------------- | -------- |
| Which AI model for vision? | GPT-4 Vision vs Claude Vision      | TBD      |
| Email service provider?    | Resend vs SendGrid                 | TBD      |
| Database choice?           | Supabase vs PlanetScale vs SQLite  | TBD      |
| How to handle NSFW images? | Reject vs process anyway           | TBD      |
| Refund policy?             | No questions asked vs case-by-case | TBD      |

---

## 11. Risks & Mitigations

| Risk                                | Likelihood | Impact | Mitigation                                |
| ----------------------------------- | ---------- | ------ | ----------------------------------------- |
| AI provides poor/generic feedback   | Medium     | High   | Iterate on prompts, consider human QA     |
| Low conversion rate                 | Medium     | High   | A/B test copy, adjust pricing             |
| Image processing costs too high     | Low        | Medium | Cache results, optimize prompts           |
| Email delivery issues               | Low        | High   | Use reliable provider, implement retries  |
| Users expect real-time chat support | Medium     | Low    | Clear messaging, FAQ, async email support |

---

## 12. Future Considerations (Post-MVP)

- Support for Bumble and Hinge
- Tiered pricing ($29 basic, $49 premium with more rewrites)
- Photo-specific suggestions with AI-generated examples
- Before/after comparison tool
- User dashboard to view past results
- Affiliate/referral program
- A/B testing different price points

---

## Appendix A: Competitor Analysis

| Competitor               | Model        | Price     | Differentiator                  |
| ------------------------ | ------------ | --------- | ------------------------------- |
| VIDA Select              | Done-for-you | $300+     | Full service                    |
| Photofeeler              | Photo rating | Free/paid | Community ratings               |
| Profile texting services | Human review | $50-100   | Manual, slow                    |
| This product             | AI automated | $29       | Fast, affordable, comprehensive |

---

## Appendix B: Copy Framework

**Headline Options:**

- "Get More Matches in 24 Hours"
- "Fix Your Tinder Profile in One Hour"
- "What's Actually Wrong With Your Profile"

**Value Proposition:**

- AI-powered analysis of your photos, bio, and prompts
- Specific feedback, not generic advice
- Rewritten bio and prompt suggestions you can copy-paste
- Results delivered to your inbox in under 1 hour

**Trust Elements:**

- Money-back guarantee (if offered)
- Number of profiles optimized (after launch)
- Before/after match rate stats (after validation)
