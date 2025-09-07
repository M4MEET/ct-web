# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# CodeX Terminal Website — Project Plan & Initial Schemas

This is a **clickable blueprint** you can iterate on. It includes: epics → tickets & checklists, acceptance criteria, env/secrets, and the first pass of schemas (Prisma, GraphQL, Zod) for the custom CMS + public site.

---

## 0) Ground Rules

* **Tech baseline:** Next.js (App Router) + TS, Tailwind + shadcn/ui, SQLite (dev default) + Postgres (prod), Prisma, Redis (Upstash), R2/S3, Vercel hosting, Sentry, PostHog, GA4, GrowthBook, Resend.
* **Content strategy:** block-based, localized (EN/DE/FR), SEO-first, draft preview, versioning, scheduled publish.
* **Security & compliance:** RBAC, 2FA (optional), strict CSP, consent-aware analytics, GDPR DSAR routes.

---

## 1) Epics → Tickets & Checklists

### EPIC A — Monorepo & Tooling

**Goal:** A clean, typed monorepo with CI/CD, linting, testing, preview environments.

**Tickets**

* **A-1:** Create monorepo skeleton (`pnpm` workspaces)

  * [x] `apps/web`, `apps/admin`
  * [x] `packages/ui`, `packages/content`, `packages/database`
  * [ ] Shared TS config, import aliases, path mapping
  * [ ] Later: `apps/worker`, `packages/config`, `packages/utils` (optional)
  * **Acceptance:** `pnpm -r build` succeeds; type sharing across apps.
* **A-2:** CI pipeline (GitHub Actions)

  * [ ] Typecheck, ESLint, Prettier
  * [ ] Unit (Jest) + e2e (Playwright) smoke
  * [ ] a11y check (axe) on main templates
  * **Acceptance:** PRs block on failures; artifacts uploaded.
* **A-3:** Vercel projects & preview

  * [ ] Link `web` and `admin`; env var groups
  * [ ] Preview deployments per PR; branch URL comments
  * **Acceptance:** Preview URLs work for both apps.
* **A-4:** Sentry + Axiom/Logtail

  * [ ] DSN wired (frontend/server)
  * [ ] Basic tracing (OpenTelemetry)
  * **Acceptance:** Errors visible with release tags.

* **A-5:** Next config consistency (apps/web)

  * [ ] Consolidate to a single `next.config.ts`
  * [ ] Wrap with `next-intl` plugin; keep `images.remotePatterns`
  * [ ] Preserve Turbopack SVG loader configuration
  * **Acceptance:** Only one Next config file; dev/build succeed.

---

### EPIC B — Data Model & Database

**Goal:** Foundational schema supporting pages, blocks, posts, services, etc., with localization & versioning.

**Tickets**

* **B-1:** Define Prisma schema v0.1 (see below)

  * [ ] Pages, BlogPosts, Services, CaseStudies, Authors, Media, Forms, Menus, Settings
  * [ ] Blocks as JSON w/ type enum + ordering
  * **Acceptance:** `prisma migrate dev` bootstraps DB; seed passes.
* **B-2:** Seed scripts

  * [ ] Minimal site settings, menu, home page
  * [ ] Example blocks (hero, features, testimonial)
  * **Acceptance:** Local app renders seeded Home.
* **B-3:** Draft/versioning tables

  * [ ] Version table (+ who/when/what)
  * [ ] Simple diff for blocks JSON
  * **Acceptance:** One-click rollback on an entity.

---

### EPIC C — Admin (Custom CMS)

**Goal:** Editor-focused admin with RBAC, media, block builder, workflow, preview.

**Tickets**

* **C-1:** Admin shell & auth

  * [ ] NextAuth (email magic + GitHub/Google), session in DB
  * [ ] Use `@auth/prisma-adapter` for persistent sessions
  * [ ] RBAC: Owner, Admin, Editor, Author
  * [ ] Enable middleware protection for `/admin/*`
  * [ ] Gate API routes with RBAC checks (edit/publish/media perms)
  * [ ] Optional TOTP 2FA
  * **Acceptance:** Role gates visible in UI; protected routes.
* **C-2:** Media library

  * [ ] Dev: local disk writes (`public/uploads`), Prod: R2/S3 via signed URLs
  * [ ] Validate magic bytes and size; rate limit; require `media.upload` perm
  * [ ] Alt text required; focal point metadata
  * **Acceptance:** Insert media into blocks; usage references.
* **C-3:** Block editor

  * [ ] Block palette (see Block Library v1)
  * [ ] Drag/sort/duplicate; per-block validation (Zod)
  * **Acceptance:** Page composed entirely in blocks.
* **C-4:** Workflow & versioning

  * [ ] Draft → In review → Scheduled → Published; comments/mentions
  * [ ] Per-field history; audit trail
  * **Acceptance:** Reviewer cannot publish without permissions.
* **C-5:** Live preview

  * [ ] Shareable draft links (expiring)
  * [ ] Exact rendering parity with public site
  * **Acceptance:** Editors see pixel-identical preview.

---

### EPIC D — Public Site

**Goal:** High-perf, SEO-first, localized site with dynamic block rendering.

**Tickets**

* **D-1:** App shell & layout

  * [x] `/[locale]/` routing (next-intl), `hreflang`, canonical
  * [x] Head tags, OG image template (Vercel OG)
  * **Acceptance:** Base pages pass Lighthouse SEO checks.
* **D-2:** Block renderer

  * [ ] Server-side block components (RSC)
  * [ ] Framer Motion for delicate micro-interactions
  * **Acceptance:** All v1 blocks render on Home.
* **D-3:** Content pages

  * [ ] Services, Case Studies, Blog, About, Careers, Contact
  * **Acceptance:** Slugged pages resolve via ISR with cache revalidate.
* **D-4:** Search (Typesense)

  * [ ] Index Posts/CaseStudies/Services
  * [ ] Instant results UI + filters
  * **Acceptance:** Sub-200ms results for top queries.
* **D-5:** Forms & routing

  * [ ] React Hook Form + Zod; hCaptcha; honeypot
  * [ ] Server actions → CRM lists/pipelines; autoresponder via Resend
  * **Acceptance:** Lead visible in CRM with UTM context.

---

### EPIC E — Marketing Stack

**Goal:** Measurement, experimentation, CRM & consent.

**Tickets**

* **E-1:** PostHog + GA4 + GTM

  * [ ] Server + client events; Web Vitals
  * [ ] Dashboards for funnels (landing → lead)
  * **Acceptance:** Key events visible with properties.
* **E-2:** GrowthBook

  * [ ] Server-side flags; cookie-based sticky bucketing
  * [ ] Variant exposure → PostHog
  * **Acceptance:** Run A/B on hero copy.
* **E-3:** Consent Management

  * [ ] Cookiebot or Klaro.js (TCF 2.2)
  * [ ] Conditional script loading
  * **Acceptance:** No trackers before consent.

---

### EPIC F — Observability, Security, Ops

**Goal:** Hardened, observable system with backups & limits.

**Tickets**

* **F-1:** CSP + security headers

  * [ ] Nonce-based scripts; strict `connect-src`
  * **Acceptance:** Report-only clean → enforced.
* **F-2:** Rate limits

  * [ ] Upstash Redis per-IP on sensitive routes
  * **Acceptance:** Abuse capped; logs visible.
* **F-3:** Backups & recovery

  * [ ] Neon PITR; R2 lifecycle policies
  * **Acceptance:** Restore drill documented.

---

### EPIC G — QA & Launch

**Goal:** Quality bar (Core Web Vitals, a11y, SEO) and launch playbook.

**Tickets**

* **G-1:** Performance budget & tests

  * [ ] LCP < 2.0s, CLS < 0.05, INP < 200ms (mobile)
  * [ ] Playwright perf/a11y assertions in CI
  * **Acceptance:** Budgets enforced in PR checks.
* **G-2:** Structured data & sitemaps

  * [ ] JSON-LD for Organization, Breadcrumb, BlogPosting, JobPosting, FAQ
  * [ ] Localized sitemaps; auto-regeneration
  * **Acceptance:** Rich results test passes.
* **G-3:** Launch checklist

  * [ ] DNS cutover; 301 map; monitoring war room
  * **Acceptance:** Error budget stable for 7 days.

---

## 2) Environments & Secrets

Create env groups (local, preview, prod). Example keys:

```
# App
NODE_ENV=
APP_URL=

# Database & Cache
DATABASE_URL=postgresql://...
REDIS_URL=...

# Storage / Media
R2_ACCOUNT_ID=
R2_BUCKET=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_PUBLIC_BASE_URL=

# Auth
NEXTAUTH_URL=
NEXTAUTH_SECRET=
OAUTH_GITHUB_ID=
OAUTH_GITHUB_SECRET=
EMAIL_SERVER=
EMAIL_FROM=

# Analytics / Experiments
POSTHOG_KEY=
POSTHOG_HOST=
GA4_ID=
GTM_ID=
GROWTHBOOK_KEY=

# CRM / Email
HUBSPOT_TOKEN=
PIPEDRIVE_TOKEN=
RESEND_API_KEY=

# Security
HCAPTCHA_SITEKEY=
HCAPTCHA_SECRET=
SENTRY_DSN=

# Search
TYPESENSE_HOST=
TYPESENSE_API_KEY=
```

---

## 3) Content Block Library v1

**Global rules**

* Every block has: `id`, `type`, `visible`, `analyticsId?`, `variant?`, `className?`.
* All text fields must support `richText` (limited marks) or plain `string` based on block kind.

**Blocks (initial)**

* `Hero`: eyebrow, headline, subcopy, media (image/video), primaryCTA, secondaryCTA, badges\[]
* `FeatureGrid`: heading, items\[{icon, title, body}], columns
* `Testimonial`: quote, author{name, role, company, avatar, logo}, metric?{label, value}
* `LogoCloud`: title?, brands\[{name,logo,url}]
* `Metrics`: items\[{label, value, helpText?}]
* `RichText`: content (portable JSON)
* `FAQ`: items\[{q, a}]
* `PriceTable`: plans\[{name, price, period, features\[], cta}]
* `Comparison`: left\[], right\[], criteria\[]
* `ContactForm`: formKey, heading, subcopy, successCopy, privacyNote
* `Media`: kind(image|video), src, alt, caption?, poster?

---

## 4) Zod Schemas (blocks, content types)

Note: In the repo, `packages/content/src/schemas/entities.ts` currently defines `Locales` as `['en','de']`. Either add `'fr'` there or drop FR from the web app to stay consistent.

```ts
// packages/content/schemas/blocks.ts
import { z } from "zod";

export const BaseBlock = z.object({
  id: z.string().uuid(),
  type: z.string(),
  visible: z.boolean().default(true),
  analyticsId: z.string().optional(),
  variant: z.string().optional(),
  className: z.string().optional(),
});

export const HeroBlock = BaseBlock.extend({
  type: z.literal("hero"),
  eyebrow: z.string().optional(),
  headline: z.string().min(3),
  subcopy: z.string().optional(),
  media: z.object({ kind: z.enum(["image", "video"]), src: z.string().url(), alt: z.string() }).optional(),
  primaryCTA: z.object({ label: z.string(), href: z.string() }).optional(),
  secondaryCTA: z.object({ label: z.string(), href: z.string() }).optional(),
  badges: z.array(z.object({ label: z.string(), icon: z.string().optional() })).optional(),
});

export const FeatureGridBlock = BaseBlock.extend({
  type: z.literal("featureGrid"),
  heading: z.string().optional(),
  columns: z.number().int().min(2).max(4).default(3),
  items: z.array(z.object({ icon: z.string().optional(), title: z.string(), body: z.string() })).min(1),
});

export const TestimonialBlock = BaseBlock.extend({
  type: z.literal("testimonial"),
  quote: z.string(),
  author: z.object({ name: z.string(), role: z.string().optional(), company: z.string().optional(), avatar: z.string().url().optional(), logo: z.string().url().optional() }),
  metric: z.object({ label: z.string(), value: z.string() }).optional(),
});

export const LogoCloudBlock = BaseBlock.extend({
  type: z.literal("logoCloud"),
  title: z.string().optional(),
  brands: z.array(z.object({ name: z.string(), logo: z.string().url(), url: z.string().url().optional() })),
});

export const MetricsBlock = BaseBlock.extend({
  type: z.literal("metrics"),
  items: z.array(z.object({ label: z.string(), value: z.string(), helpText: z.string().optional() })),
});

export const RichTextBlock = BaseBlock.extend({
  type: z.literal("richText"),
  content: z.any(), // portable text JSON
});

export const FAQBlock = BaseBlock.extend({
  type: z.literal("faq"),
  items: z.array(z.object({ q: z.string(), a: z.string() })).min(1),
});

export const PriceTableBlock = BaseBlock.extend({
  type: z.literal("priceTable"),
  plans: z.array(z.object({ name: z.string(), price: z.string(), period: z.string(), features: z.array(z.string()), cta: z.object({ label: z.string(), href: z.string() }) })),
});

export const ComparisonBlock = BaseBlock.extend({
  type: z.literal("comparison"),
  criteria: z.array(z.string()),
  left: z.array(z.string()),
  right: z.array(z.string()),
});

export const ContactFormBlock = BaseBlock.extend({
  type: z.literal("contactForm"),
  formKey: z.string(),
  heading: z.string().optional(),
  subcopy: z.string().optional(),
  successCopy: z.string().optional(),
  privacyNote: z.string().optional(),
});

export const MediaBlock = BaseBlock.extend({
  type: z.literal("media"),
  kind: z.enum(["image", "video"]),
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  poster: z.string().optional(),
});

export const AnyBlock = z.discriminatedUnion("type", [
  HeroBlock,
  FeatureGridBlock,
  TestimonialBlock,
  LogoCloudBlock,
  MetricsBlock,
  RichTextBlock,
  FAQBlock,
  PriceTableBlock,
  ComparisonBlock,
  ContactFormBlock,
  MediaBlock,
]);

export type AnyBlock = z.infer<typeof AnyBlock>;
```

```ts
// packages/content/schemas/entities.ts
import { z } from "zod";
import { AnyBlock } from "./blocks";

export const SEO = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  noindex: z.boolean().optional(),
  canonical: z.string().url().optional(),
  ogImage: z.string().url().optional(),
});

export const Locales = z.enum(["en", "de", "fr"]);

export const Page = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  locale: Locales,
  title: z.string(),
  seo: SEO.optional(),
  blocks: z.array(AnyBlock),
  status: z.enum(["draft", "inReview", "scheduled", "published"]).default("draft"),
  scheduledAt: z.string().datetime().optional(),
  updatedBy: z.string().optional(),
});
```

---

## 5) Prisma Schema v0.1

Note: The repo’s Prisma datasource is `sqlite` for local development. Switch `provider` to `postgresql` and update `DATABASE_URL` when deploying to Postgres.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum RoleName { OWNER ADMIN EDITOR AUTHOR }

enum Locale { en de fr }

enum PublishStatus { draft inReview scheduled published }

enum BlockType {
  hero
  featureGrid
  testimonial
  logoCloud
  metrics
  richText
  faq
  priceTable
  comparison
  contactForm
  media
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  role      RoleName @default(AUTHOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // sessions, accounts for NextAuth via adapter models (add as needed)
}

model MediaAsset {
  id        String   @id @default(cuid())
  kind      String   // image|video|file
  url       String
  alt       String?
  meta      Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Page {
  id          String        @id @default(cuid())
  slug        String
  locale      Locale
  title       String
  seo         Json?
  status      PublishStatus @default(draft)
  scheduledAt DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  updatedById String?
  updatedBy   User?         @relation(fields: [updatedById], references: [id])

  blocks      Block[]

  @@unique([slug, locale])
}

model BlogPost {
  id          String        @id @default(cuid())
  slug        String
  locale      Locale
  title       String
  excerpt     String?
  coverId     String?
  cover       MediaAsset?   @relation(fields: [coverId], references: [id])
  seo         Json?
  status      PublishStatus @default(draft)
  scheduledAt DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  authorId    String?
  author      Author?       @relation(fields: [authorId], references: [id])

  blocks      Block[]

  @@unique([slug, locale])
}

model Service {
  id          String        @id @default(cuid())
  slug        String
  locale      Locale
  name        String
  summary     String?
  seo         Json?
  status      PublishStatus @default(draft)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  blocks      Block[]

  @@unique([slug, locale])
}

model CaseStudy {
  id          String        @id @default(cuid())
  slug        String
  locale      Locale
  title       String
  client      String?
  sector      String?
  seo         Json?
  status      PublishStatus @default(draft)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  blocks      Block[]

  @@unique([slug, locale])
}

model Author {
  id     String  @id @default(cuid())
  name   String
  role   String?
  bio    String?
  avatar String?
  xUrl   String?
  liUrl  String?
}

model Testimonial {
  id      String @id @default(cuid())
  quote   String
  author  String
  role    String?
  company String?
  logoId  String?
  logo    MediaAsset? @relation(fields: [logoId], references: [id])
}

model Form {
  id         String   @id @default(cuid())
  key        String   @unique
  name       String
  fields     Json
  validation Json?
  routing    Json?
  autoresp   Json?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Menu {
  id     String @id @default(cuid())
  key    String @unique
  items  Json
}

model SiteSetting {
  id        String  @id @default(cuid())
  key       String  @unique
  value     Json
  updatedAt DateTime @updatedAt
}

// Polymorphic Block parent via optional FKs
model Block {
  id        String    @id @default(cuid())
  type      BlockType
  data      Json
  order     Int

  pageId     String?
  page       Page?     @relation(fields: [pageId], references: [id])

  postId     String?
  post       BlogPost? @relation(fields: [postId], references: [id])

  serviceId  String?
  service    Service?  @relation(fields: [serviceId], references: [id])

  caseId     String?
  case       CaseStudy? @relation(fields: [caseId], references: [id])

  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([pageId])
  @@index([postId])
  @@index([serviceId])
  @@index([caseId])
}

model Version {
  id        String   @id @default(cuid())
  entity    String   // e.g., 'Page', 'BlogPost'
  entityId  String
  snapshot  Json
  createdAt DateTime  @default(now())
  createdBy String?
}
```

---

## 6) GraphQL Schema [Optional/Future — not used in repo]

```graphql
# schema.graphql (excerpt)
scalar JSON

enum Locale { en de fr }

enum BlockType {
  hero
  featureGrid
  testimonial
  logoCloud
  metrics
  richText
  faq
  priceTable
  comparison
  contactForm
  media
}

type SEO { title: String, description: String, noindex: Boolean, canonical: String, ogImage: String }

type Media { id: ID!, kind: String!, url: String!, alt: String, meta: JSON }

interface Block { id: ID!, type: BlockType!, visible: Boolean }

type HeroBlock implements Block { id: ID!, type: BlockType!, visible: Boolean, eyebrow: String, headline: String!, subcopy: String, media: Media, primaryCTA: CTA, secondaryCTA: CTA, badges: [Badge!] }

type FeatureGridBlock implements Block { id: ID!, type: BlockType!, visible: Boolean, heading: String, columns: Int, items: [FeatureItem!]! }

# ...other block types

type Page { id: ID!, slug: String!, locale: Locale!, title: String!, seo: SEO, blocks: [Block!]! }

type BlogPost { id: ID!, slug: String!, locale: Locale!, title: String!, excerpt: String, cover: Media, seo: SEO, blocks: [Block!]! }

type Service { id: ID!, slug: String!, locale: Locale!, name: String!, summary: String, seo: SEO, blocks: [Block!]! }

type CaseStudy { id: ID!, slug: String!, locale: Locale!, title: String!, client: String, sector: String, seo: SEO, blocks: [Block!]! }

union BlockUnion = HeroBlock | FeatureGridBlock | TestimonialBlock | LogoCloudBlock | MetricsBlock | RichTextBlock | FAQBlock | PriceTableBlock | ComparisonBlock | ContactFormBlock | MediaBlock

# Public queries
 type Query {
  page(slug: String!, locale: Locale!): Page
  blogPost(slug: String!, locale: Locale!): BlogPost
  service(slug: String!, locale: Locale!): Service
  caseStudy(slug: String!, locale: Locale!): CaseStudy
  search(query: String!, locale: Locale!): [SearchResult!]!
 }
```

---

## 7) Public Site — Routing & Rendering

**Routes**

```
/app/(public)/[locale]/page.tsx          → Home
/app/(public)/[locale]/[...slug]/page.tsx → Catch-all renderer (Page/Service/Post/CaseStudy)
/app/(public)/api/preview/route.ts        → Draft previews (token + id)
/app/(public)/api/forms/[key]/route.ts    → Form submit → CRM + Resend
```

**Renderer sketch**

```tsx
// apps/web/components/BlockRenderer.tsx
import { Suspense } from "react";
import * as Blocks from "@/blocks"; // index exports block components

export function BlockRenderer({ blocks }: { blocks: AnyBlock[] }) {
  return (
    <div>
      {blocks.filter(b => b.visible !== false).sort((a,b)=> (a.order??0)-(b.order??0)).map(block => {
        const Cmp = (Blocks as any)[block.type];
        if (!Cmp) return null;
        return (
          <Suspense key={block.id}>
            <Cmp {...block} />
          </Suspense>
        );
      })}
    </div>
  );
}
```

---

## 8) Admin — Preview Flow

* Draft content saved → signed **preview token** issued
* `/api/preview?token=...&kind=page&id=...` sets preview cookies and redirects to public route
* Public route fetches **draft** via header (`x-preview: true`) and bypasses ISR cache
* Expire token after short TTL; Redis to map token → entity/version

**Acceptance:** Visual parity between admin preview and public site.

---

## 9) Search Indexing (Typesense)

* Index `title`, `excerpt`, `bodyPlain`, `tags`, `locale`, `type`, `slug`
* Webhook on publish → enqueue job to upsert document
* Admin reindex button for full rebuild

**Relevance:** locale boost, type boost (CaseStudy > Service > BlogPost), recency decay for blog.

---

## 10) Event Tracking (initial spec)

**Global properties:** `locale`, `pageType`, `slug`, `utm_*`, `referrer`.

**Events**

* `page_view`
* `cta_click` { id, label, href }
* `form_start` { formKey }
* `form_submit` { formKey, success, validationErrors }
* `lead_routed` { crm: "hubspot"|"pipedrive", pipeline, list }
* `experiment_viewed` { flagKey, variant }

---

## 11) Performance Budgets & Checks

* **LCP < 2.0s**, **CLS < 0.05**, **INP < 200ms** on Mobile
* Preload hero media, avoid layout shifts, font subsetting
* CI asserts budgets on top templates (Home, Service, BlogPost)

---

## 12) Launch Checklist (abridged)

* [ ] Content freeze & final QA
* [ ] DNS cutover plan & rollback
* [ ] 301 map for legacy URLs
* [ ] Robots.txt & sitemaps verified
* [ ] Consent manager live & verified
* [ ] Uptime + error alerting thresholds
* [ ] Post-launch watch (24–72h) & fixes

---

## 13) Local Dev Quickstart

```
# repo
pnpm i

# db (database package)
pnpm --filter @codex/database db:migrate
pnpm --filter @codex/database db:seed

# apps
pnpm --filter @codex/web dev
pnpm --filter @codex/admin dev
```

---

## 14) Internationalization Implementation (PARTIAL)

**Status:** ⚠️ PARTIAL - Web app supports EN/DE/FR; content schemas allow EN/DE. Align locales.

**Implementation Details:**

* **next-intl** integration for Next.js 15
* Dynamic routing with `/[locale]/` structure
* Server-side translations via `getTranslations()`
* Language switcher component with current language display
* Middleware for automatic locale detection and routing
* Translation files for EN/DE/FR with navigation and common text

**Files Modified:**
* `apps/web/next.config.js` - Added next-intl plugin
* `apps/web/src/i18n.ts` - Core i18n configuration
* (TODO) `apps/web/src/middleware.ts` - Locale routing middleware
* `apps/web/src/app/layout.tsx` - Root layout cleanup
* `apps/web/src/app/[locale]/layout.tsx` - Localized layout with proper HTML lang
* `apps/web/src/app/[locale]/page.tsx` - Homepage with locale params
* `apps/web/src/components/LanguageSwitcher.tsx` - Language dropdown with current selection
* `apps/web/src/components/Navigation.tsx` - Localized navigation
* `apps/web/messages/en.json` - English translations
* `apps/web/messages/de.json` - German translations
* `apps/web/messages/fr.json` - French translations (ensure `packages/content` allows `fr` or remove)

**Key Features:**
* URL-based locale detection to prevent hydration mismatches
* Automatic language switching with proper current language display
* SEO-friendly with proper `hreflang` and canonical URLs
* Server-side rendering compatible
* Fixed header spacing (pt-20) to account for fixed navigation

---

## 15) Admin Interface Implementation (COMPLETED)

**Status:** ✅ COMPLETED - Full admin interface with authentication, user management, and proper branding

**Implementation Details:**

* **NextAuth v5** with JWT strategy and custom credentials provider  
* **Complete Users Management** with role assignment (OWNER, ADMIN, EDITOR, AUTHOR)
* **Authentication-first flow** with proper login redirects and session handling
* **Professional branding** with CodeX Terminal logo and real user information display
* **Responsive admin layout** with navigation sidebar and main content area

**Core Features Implemented:**
* ✅ **Admin Navigation**: Reordered menu items (Dashboard → Pages → Services → Case Studies → Blog Posts → Media → Forms → Users → Settings)
* ✅ **User Management Page**: Complete CRUD operations for users with role assignment, statistics dashboard, and professional modal design
* ✅ **Authentication System**: Login-first flow, session management, sign out functionality
* ✅ **Admin Header**: CodeX Terminal color logo, real user info display (name, email, role), removed placeholder text
* ✅ **Signin Page**: Branded signin with CodeX Terminal background, floating gradient orbs, glass-morphism design

**Files Modified:**
* `apps/admin/src/components/layout/AdminNav.tsx` - Navigation with logo and user info
* `apps/admin/src/components/layout/AdminLayout.tsx` - Authentication wrapper and layout
* `apps/admin/src/app/admin/users/page.tsx` - Complete Users management interface
* `apps/admin/src/app/api/users/route.ts` - Users CRUD API endpoints
* `apps/admin/src/app/api/users/[id]/route.ts` - Individual user operations
* `apps/admin/src/app/auth/signin/page.tsx` - Branded signin page with CodeX Terminal styling
* `apps/admin/src/middleware.ts` - Authentication middleware with static asset exclusion
* `apps/admin/public/codex-logo-color.svg` - CodeX Terminal color logo

**Key Features:**
* **Role-based Access Control**: Support for OWNER, ADMIN, EDITOR, AUTHOR roles with proper permissions
* **Real User Data**: Displays actual logged-in user information instead of demo data
* **Professional Design**: Glass-morphism effects, gradient backgrounds matching frontend branding
* **Responsive UI**: Mobile-friendly design with proper breakpoints
* **Security**: Proper authentication middleware, email domain restrictions (@codexterminal.com)

**User Management Features:**
* User statistics dashboard with counts for total, active, verified, and 2FA users
* Complete users table with avatar, role indicators, status badges, and edit actions  
* Create/Edit user modal with email validation, role assignment, and active/inactive toggles
* Soft delete functionality (deactivates users instead of permanent deletion)
* Professional modal design with gradient headers and enhanced UX

**Authentication Flow:**
* Automatic redirect to signin for unauthenticated users
* Proper callback URL handling for post-login redirection
* Session-based user information display throughout admin interface
* Working sign out functionality with redirect to login

---

## 16) Next Steps (recommended order)

1. Implement **EPIC A** (A-1 → A-4)
2. Apply **Prisma v0.1** and seed (B-1, B-2)
3. Ship **Admin auth + Block editor MVP** (C-1, C-3 minimal)
4. Build **Public block renderer** + Home (D-1, D-2)
5. Wire **forms → CRM + Resend** (D-5)
6. Add **analytics/consent** (E-1, E-3)
7. Harden **CSP/rate limits** (F-1, F-2)
8. QA, performance budgets, structured data, launch (G-\*)

> This doc is the living source of truth — update tickets, checklists, and schemas as we iterate.
