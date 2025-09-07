# Repository Guidelines

## Project Structure & Module Organization
- `apps/web`: Public site (Next.js App Router) — localized routes under `src/app/[locale]`.
- `apps/admin`: Custom CMS (Next.js) — APIs under `src/app/api`, admin pages under `src/app/admin`.
- `packages/database`: Prisma schema, migrations in `prisma/migrations`, seed in `prisma/seed.ts`.
- `packages/content`: Zod content schemas shared across apps.
- `packages/ui`: Shared React UI components.
- `.github/workflows`: CI for lint, typecheck, build.

## Build, Test, and Development Commands
From repo root (pnpm workspaces + Turborepo):
- `pnpm dev`: Run all apps in dev.
- `pnpm web:dev` / `pnpm admin:dev`: Run a single app (3000/3001).
- `pnpm build`: Build all packages/apps.
- `pnpm lint` / `pnpm typecheck`: ESLint and TypeScript checks.
- `pnpm test`: Run package tests (if present).
- Database: `pnpm db:migrate`, `pnpm db:seed`, `pnpm db:studio`.

## Coding Style & Naming Conventions
- Language: TypeScript. Formatting via Prettier (2 spaces, single quotes, semicolons).
- Linting: ESLint (`.eslintrc.js`) with TypeScript rules; avoid `any`, keep `no-unused-vars` (underscore to ignore).
- React: Components in `PascalCase.tsx`; hooks `useThing.ts`; utilities `camelCase.ts`.
- Next.js: Route files `page.tsx`, API routes `route.ts`, middleware `middleware.ts`.
- Imports: Prefer absolute from app root or package name (e.g., `@codex/content`).

## Testing Guidelines
- Framework: Not standardized yet. Co-locate tests as `*.test.ts(x)` next to source or in `__tests__`.
- Run with `pnpm test` at root; per-package scripts may be added as testing matures.
- Aim for unit tests on content schemas and critical UI, and integration tests around Prisma data access.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`.
- Scope by package/app when helpful: `feat(web): ...`, `fix(database): ...`.
- PRs: Include concise description, linked issues, screenshots for UI, and notes for schema changes.
- Database changes: include Prisma migration in `packages/database/prisma/migrations` and update seeds when applicable.

## Security & Configuration Tips
- Copy `.env.example` → `.env.local` (do not commit secrets). Key vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, storage (R2/S3) keys.
- For local dev: start Postgres, then `pnpm db:migrate && pnpm db:seed`.
- Follow CSP and authentication patterns in existing middleware and API routes.
