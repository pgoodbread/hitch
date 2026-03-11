# Hitch - Development Guidelines

## Workflow

- Always pull the latest main (`git checkout main && git pull`) before creating a feature branch
- Always create a feature branch before starting work
- Run `npm run build` and `npm run lint` before committing — both must pass
- Run tests if test infrastructure exists (`npm run test:run`)
- Create a pull request for every feature — never push directly to main
- Commit with descriptive messages

## Stack

- Next.js 15 (App Router) with React 19
- TypeScript 5.8
- Tailwind CSS 4.1 with PostCSS
- Headless UI components + Lucide React icons
- Supabase (PostgreSQL) for database
- PostHog analytics (cookie-consent gated)
- Stripe payment link ($29 one-time)
- Vitest + Testing Library for tests

## Key Patterns

- Landing page lives at `src/app/page.tsx` with a 3-step CTA modal in `src/components/optimize-modal.tsx`
- Programmatic SEO city pages at `src/app/tinder-profile-help/[city]/page.tsx` with data in `src/data/cities.ts`
- Lead capture API at `src/app/api/leads/route.ts` with Supabase upsert (email deduplication)
- Use `clsx()` for conditional classnames
- Prettier with Tailwind plugin; ESLint 9 with Next.js config
- Husky + lint-staged for pre-commit hooks (eslint --fix, prettier --write)
- Supabase clients split: `src/lib/supabase/client.ts` (browser) and `src/lib/supabase/server.ts` (SSR with cookies)
- City pages use `generateStaticParams()` for build-time static generation
- PostHog tracking is client-side with UTM source capture; session recording disabled
- Supabase migrations live in `supabase/migrations/` with naming convention `YYYYMMDD_description.sql`
- Webhook routes follow a shared pattern: read raw body, verify signature, use `after()` for background processing, return `{ received: true }` (see `src/app/api/webhooks/stripe/route.ts`)
- Resend SDK (`resend` package) handles both sending and webhook verification — `resend.webhooks.verify()` takes a single object arg `{ payload, headers: { id, timestamp, signature }, webhookSecret }`

## Environment Variables

Required in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — Supabase public anon key
- `NEXT_PUBLIC_POSTHOG_KEY` — PostHog project API key
- `NEXT_PUBLIC_POSTHOG_HOST` — PostHog ingestion host
- `NEXT_PUBLIC_SITE_URL` — Base site URL
- `KIT_API_KEY` — Kit.so email capture key
