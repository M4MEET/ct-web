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
- Docker & Docker Compose (recommended)
- PostgreSQL 16+ (if not using Docker)
- Redis (optional for caching)

### Option 1: Docker Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/codex-terminal.git
cd codex-terminal

# Initialize with Docker (automated setup)
make init

# Or manually:
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker compose exec admin sh -c "cd packages/database && pnpm prisma migrate deploy"
docker compose exec admin sh -c "cd packages/database && pnpm prisma db seed"

# Access applications
# Web: http://localhost:3000
# Admin: http://localhost:3001
# Prisma Studio: http://localhost:5555 (run: make studio)
```

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/your-org/codex-terminal.git
cd codex-terminal

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up the database
pnpm db:migrate
pnpm db:seed

# Start development servers
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

### Docker Commands (via Makefile)
- `make init` - First-time project setup with Docker
- `make dev` - Start development environment
- `make prod` - Start production environment
- `make db-migrate` - Run database migrations in Docker
- `make db-backup` - Backup database
- `make studio` - Open Prisma Studio GUI
- `make logs` - View container logs
- `make health` - Check service health
- `make clean` - Remove all containers and volumes

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

## 🐳 Docker Support

This project includes complete Docker containerization for both development and production:

- **PostgreSQL 15** database with automatic migrations
- **Redis 7** for caching and sessions
- **Multi-stage builds** for optimized production images
- **Docker Compose** orchestration with health checks
- **Development hot-reload** with volume mounts

See [DOCKER-SETUP.md](./DOCKER-SETUP.md) for detailed Docker documentation.

## 🚀 Production Deployment

The project is production-ready with multiple deployment options:

- **Docker on VPS** (Hetzner Cloud recommended: €5-15/month)
- **Vercel** for serverless deployment
- **Railway/Render** for managed container hosting

See [PRODUCTION-DEPLOYMENT-GUIDE.md](./PRODUCTION-DEPLOYMENT-GUIDE.md) for complete deployment instructions.

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - AI assistant instructions and project context
- [DOCKER-SETUP.md](./DOCKER-SETUP.md) - Complete Docker documentation
- [PRODUCTION-DEPLOYMENT-GUIDE.md](./PRODUCTION-DEPLOYMENT-GUIDE.md) - Production deployment guide
- [Makefile](./Makefile) - Available make commands

## 📝 License

Private repository - All rights reserved

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## 📧 Contact

For questions or support, contact the development team.