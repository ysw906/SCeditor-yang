# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, framer-motion, lucide-react

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── portfolio/          # Science Content Creator Portfolio (React+Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml     # pnpm workspace
├── tsconfig.base.json      # Shared TS options
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Packages

### `artifacts/portfolio` (`@workspace/portfolio`)

The main portfolio website for science content creator 양승우.
- **URL**: `/` (root path)
- **Design**: Black & white, elegant editorial style
- **Pages**: 
  - `/` - Portfolio home with Hero, Projects, Career, Skills, Closing sections
  - `/project/:id` - Project detail page with image gallery and sections
  - `/login` - Admin login page (ID: sample, PW: sample)
  - `/admin` - Admin dashboard with full editing capabilities

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes include:
- `POST /api/auth/login` - Login (sample/sample)
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET/PUT /api/portfolio/hero`
- `GET/POST /api/portfolio/projects`
- `GET/PUT/DELETE /api/portfolio/projects/:id`
- `GET/PUT /api/portfolio/skills`
- `GET/PUT /api/portfolio/closing`
- `GET/PUT /api/portfolio/career`
- `GET/PUT /api/portfolio/settings`

### `lib/db` (`@workspace/db`)

Database schema includes: hero, projects, skills, closing, settings, career, contact tables.

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI spec for the portfolio API. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

## Admin Access

- URL: `/login`
- ID: `sample`
- Password: `sample`
- Features: Edit hero content, projects (CRUD), career entries, skills, closing text, contact section (email, phone, location, links, note), site settings
- Font size controls, image URL management, category/section editing
