# CodeX Terminal Website

## Project Overview

This is a monorepo for a modern website and its custom Content Management System (CMS). The project is built with a focus on performance, type-safety, and a streamlined development experience.

- **Frontend & Backend:** The entire project is built using Next.js 15 with the App Router, allowing for a mix of server-side rendering (SSR) and static site generation (SSG).
- **Language:** The codebase is written entirely in TypeScript 5, ensuring type safety and improved developer experience.
- **Database:** The project uses PostgreSQL as its database, with Prisma ORM for database access and schema management.
- **Monorepo:** The project is organized as a monorepo using pnpm workspaces and Turborepo for efficient task running.

### Key Components

- **`apps/web`:** The public-facing website, which includes internationalization (EN/DE) and renders dynamic content from the CMS.
- **`apps/admin`:** The custom CMS for managing the website's content. It features a block editor, role-based access control (RBAC), and content versioning.
- **`packages/database`:** Contains the Prisma schema, database client, and seeding scripts.
- **`packages/content`:** Defines the Zod schemas for validating the content structures.
- **`packages/ui`:** A shared library of React components used across both the `web` and `admin` applications.

## Building and Running

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (recommended)

### Docker Setup (Recommended)

The recommended way to get started is by using the provided Docker setup, which automates the entire process.

```bash
# First-time project setup with Docker
make init

# Start the development environment
make dev
```

- **Web:** `http://localhost:3000`
- **Admin:** `http://localhost:3001`
- **Prisma Studio:** `http://localhost:5555` (run `make studio`)

### Local Development

If you prefer to run the project without Docker, you can use the following commands:

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Run database migrations and seed the database
pnpm db:migrate
pnpm db:seed

# Start all applications in development mode
pnpm dev
```

### Key Commands

- **`pnpm dev`:** Starts all applications in development mode.
- **`pnpm build`:** Builds all applications for production.
- **`pnpm lint`:** Lints the entire codebase.
- **`pnpm typecheck`:** Runs TypeScript type-checking across all packages.
- **`pnpm test`:** Runs all tests.

## Development Conventions

- **Monorepo Structure:** All code is organized within the `apps` and `packages` directories. This promotes code sharing and modularity.
- **TypeScript:** The entire codebase is written in TypeScript. Make sure to follow best practices for type safety.
- **ESLint & Prettier:** The project is configured with ESLint and Prettier to enforce a consistent coding style. It is recommended to integrate these tools with your code editor.
- **Database Migrations:** Database schema changes are managed through Prisma Migrate. When you make changes to the `schema.prisma` file, you will need to create a new migration.
- **Commit Messages:** While not explicitly defined, it is recommended to follow conventional commit message standards.
