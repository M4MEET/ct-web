# CodeX Terminal Website

A modern, high-performance website with custom CMS built using Next.js, TypeScript, and Prisma.

## 🏗 Architecture

This project is organized as a monorepo using pnpm workspaces:

- **`apps/web`** - Public-facing website with localization (EN/DE)
- **`apps/admin`** - Custom CMS with block editor and workflow management
- **`packages/database`** - Prisma ORM and database schemas
- **`packages/content`** - Zod schemas for content validation
- **`packages/ui`** - Shared UI components library
- **`packages/config`** - Shared configuration
- **`packages/utils`** - Shared utilities

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 16+
- Redis (optional for caching)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/codex-terminal.git
cd codex-terminal
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
pnpm --filter @codex/database db:migrate
pnpm --filter @codex/database db:seed
```

5. Start development servers:
```bash
# Start all apps
pnpm dev

# Or start individually
pnpm web:dev    # Public site at http://localhost:3000
pnpm admin:dev  # Admin CMS at http://localhost:3001
```

## 📁 Project Structure

```
ct-web/
├── apps/
│   ├── web/          # Public website (Next.js)
│   └── admin/        # Admin CMS (Next.js)
├── packages/
│   ├── database/     # Prisma schemas & client
│   ├── content/      # Content type schemas (Zod)
│   ├── ui/           # Shared UI components
│   ├── config/       # Shared configuration
│   └── utils/        # Shared utilities
├── .github/
│   └── workflows/    # CI/CD pipelines
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

## 🛠 Available Commands

### Root Commands
- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps
- `pnpm lint` - Run ESLint across all packages
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm test` - Run tests across all packages
- `pnpm clean` - Clean all build artifacts and node_modules

### Database Commands
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed the database
- `pnpm db:studio` - Open Prisma Studio

## 🎯 Key Features

### Public Website
- Server-side rendering with Next.js App Router
- Internationalization (EN/DE) with next-intl
- Dynamic block-based content rendering
- SEO optimization with structured data
- Performance optimized (LCP < 2.0s, CLS < 0.05)

### Admin CMS
- Role-based access control (RBAC)
- Block editor with drag-and-drop
- Content versioning and rollback
- Workflow management (draft → review → published)
- Media library with R2/S3 integration
- Live preview of content changes

### Technical Stack
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript 5
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS + shadcn/ui
- **Validation:** Zod schemas
- **Authentication:** NextAuth.js
- **Analytics:** PostHog, Google Analytics 4
- **Monitoring:** Sentry
- **Hosting:** Vercel

## 📊 Performance Targets

- **LCP:** < 2.0s (mobile)
- **CLS:** < 0.05
- **INP:** < 200ms
- **Lighthouse Score:** 90+

## 🔒 Security

- Content Security Policy (CSP) headers
- Rate limiting on sensitive endpoints
- Input validation with Zod
- GDPR-compliant consent management
- Regular dependency updates

## 📝 License

Private repository - All rights reserved

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📧 Contact

For questions or support, contact the development team.