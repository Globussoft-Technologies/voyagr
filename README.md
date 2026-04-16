# Voyagr

The open-source, multi-tenant CMS built for travel companies.

`Multi-Tenant` `100 Themes` `Blog Engine` `Newsletter` `SEO` `Self-Hostable` `Open Source`

## Overview

Voyagr is a full-featured content management system purpose-built for the travel industry. It gives travel agencies, tour operators, hospitality brands, and independent travel bloggers a single platform to build websites, publish blogs, send newsletters, and manage SEO -- all without writing code.

Every account operates as an isolated tenant with its own subdomain (e.g., `acme.voyagr.com`) or custom domain (`acme.com`). Content, media, team members, and settings are fully scoped per tenant, so a single Voyagr installation can power hundreds of independent travel brands.

Voyagr is self-hostable and ships with Docker Compose, PM2 process management, and nginx configuration out of the box. Run it on a $5 VPS or a dedicated server -- no vendor lock-in, no per-seat pricing, no surprises.

## Features

### Content Management

- Rich text editor powered by TipTap with 17 extensions (bold, italic, underline, headings, tables, images, links, text color, highlight, font family, text alignment, code blocks, horizontal rules, subscript, superscript, typography, placeholders)
- Page management with CRUD operations, custom slugs, sort ordering, and publish/draft workflow
- Blog system with posts, categories, tags, featured images, excerpts, and scheduled publishing
- Media library with image upload, dimension tracking, alt text, and per-tenant isolation

### Multi-Tenancy

- Subdomain-based routing (`acme.voyagr.com`)
- Custom domain mapping (`acme.com` -> tenant)
- Complete tenant isolation (all data scoped by `tenantId`)
- Team management with roles: Owner, Admin, Editor

### Design and Themes

- 100 pre-built themes across 20 travel niches (luxury, adventure, backpacker, cruise, cultural, family, safari, urban, wellness, and more)
- 15 layout templates (starter, luxury, adventure, backpacker, cruise, cultural, family, safari, urban, wellness, magazine, minimal, bold, gallery, elegant)
- Theme engine with CSS custom properties for colors, fonts, and layout
- Google Fonts integration loaded dynamically per theme
- Real-time theme switching from the dashboard

### Marketing

- Newsletter system with subscriber management, campaign builder, and bulk email sending via SMTP
- SEO controls including meta title, meta description, Open Graph images, and JSON-LD structured data
- Social sharing buttons (Facebook, X, LinkedIn, WhatsApp, copy link)
- Subscribe widget for tenant public sites

### Navigation

- Menu builder with drag-and-drop reordering
- Nested menu items via parent-child relationships
- Public navigation component rendered on tenant sites

### Security

- Auth.js v5 with JWT session strategy
- XSS sanitization via DOMPurify on all rendered HTML
- Rate limiting on public endpoints (sign-up, newsletter subscribe)
- CSRF protection via allowed origins configuration
- Bcrypt password hashing (12 rounds)
- Input validation with Zod schemas

### Infrastructure

- Docker + Docker Compose for self-hosting
- Multi-stage Dockerfile (deps -> build -> runner) for minimal image size
- PM2 process management with memory limits and auto-restart
- nginx reverse proxy with SSL (Let's Encrypt + Cloudflare DNS for wildcard certs)
- ISR caching with 60-second revalidation on tenant pages
- Prisma migrations for schema management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | MySQL 8 + Prisma 6 ORM |
| Auth | Auth.js v5 (NextAuth) |
| Styling | Tailwind CSS 4 |
| Editor | TipTap (17 extensions) |
| Email | Nodemailer (SMTP) |
| Validation | Zod |
| Sanitization | DOMPurify / isomorphic-dompurify |
| Runtime | Node.js 24 |
| Process Manager | PM2 |
| Reverse Proxy | nginx |
| SSL | Let's Encrypt (certbot + Cloudflare DNS) |
| Containerization | Docker + Docker Compose |

## Quick Start

### Prerequisites

- Node.js 24+
- MySQL 8+
- npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-org/voyagr.git
cd voyagr

# Create environment file
cp .env.example .env
# Edit .env with your MySQL credentials and generate AUTH_SECRET:
#   openssl rand -base64 32

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Start the dev server
npm run dev
```

Open `http://lvh.me:3000` for the landing page (apex domain) and `http://yourtenant.lvh.me:3000` for a tenant subdomain. The `lvh.me` domain resolves to `127.0.0.1` and supports subdomains out of the box -- no `/etc/hosts` editing required.

### Docker

```bash
# Create environment file from the Docker template
cp .env.docker .env
# Edit .env -- set MYSQL_PASSWORD, MYSQL_ROOT_PASSWORD, AUTH_SECRET, DATABASE_URL

# Start services
docker compose up -d

# Run database migrations (first time only)
docker compose exec app npx prisma migrate deploy
```

The app will be available at `http://localhost:3000`.

### Seed Demo Content

```bash
npm run seed:demo
```

This populates a tenant with sample pages, blog posts, categories, tags, and menu items so you can explore the platform immediately.

## Project Structure

```
voyagr/
├── prisma/                 # Schema + migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed-demo.ts        # Demo content seeder
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page (apex domain)
│   │   ├── sign-up/              # Registration
│   │   ├── sign-in/              # Login
│   │   ├── dashboard/            # Admin panel
│   │   │   ├── pages/            # Page management
│   │   │   ├── posts/            # Blog management
│   │   │   ├── media/            # Media library
│   │   │   ├── newsletter/       # Newsletter campaigns
│   │   │   ├── team/             # Team management
│   │   │   └── settings/         # Theme, nav, SEO, domains
│   │   ├── api/                  # REST API routes
│   │   │   ├── auth/             # Auth endpoints
│   │   │   ├── pages/            # Page CRUD
│   │   │   ├── posts/            # Post CRUD
│   │   │   ├── media/            # Upload + manage
│   │   │   ├── menus/            # Navigation
│   │   │   ├── newsletter/       # Subscribers + campaigns
│   │   │   ├── team/             # Team management
│   │   │   └── tenant/           # Tenant settings
│   │   └── sites/[domain]/       # Tenant public site (rewritten via middleware)
│   │       ├── layout.tsx        # Theme + fonts + nav
│   │       ├── page.tsx          # Home page
│   │       ├── [slug]/           # Individual pages
│   │       └── blog/             # Blog listing + posts
│   ├── components/
│   │   ├── editor/               # TipTap rich text editor
│   │   ├── media/                # Media library + upload
│   │   ├── navigation/           # Public nav component
│   │   ├── newsletter/           # Subscribe widget
│   │   ├── seo/                  # SEO fields, share buttons, JSON-LD
│   │   └── theme/                # Theme picker
│   ├── lib/
│   │   ├── db.ts                 # Prisma client singleton
│   │   ├── domain.ts             # Subdomain extraction + custom domains
│   │   ├── tenant.ts             # Auth helpers + tenant validation
│   │   ├── storage.ts            # File upload service
│   │   ├── email.ts              # SMTP email service
│   │   ├── sanitize.ts           # XSS sanitization
│   │   ├── rate-limit.ts         # Rate limiting
│   │   ├── seo.ts                # SEO metadata builder
│   │   ├── api-helpers.ts        # API response helpers
│   │   ├── permissions.ts        # Role-based access control
│   │   └── themes/
│   │       ├── registry.ts       # 100 theme configurations
│   │       └── theme-provider.tsx # CSS variable injection
│   ├── themes/                   # 15 layout templates
│   │   ├── starter/              # Clean, modern (default)
│   │   ├── luxury/               # Elegant, serif
│   │   ├── adventure/            # Bold, dynamic
│   │   ├── bold/                 # Dark, striking
│   │   ├── minimal/              # Ultra-minimalist
│   │   ├── magazine/             # Editorial layout
│   │   ├── gallery/              # Photo-heavy
│   │   ├── elegant/              # Refined serif
│   │   └── ...                   # 15 total layouts
│   └── auth.ts                   # Auth.js configuration
├── deploy/                       # nginx config
├── docs/                         # Self-hosting guide
├── scripts/                      # SSH helper, E2E tests
├── Dockerfile
├── docker-compose.yml
└── ecosystem.config.cjs          # PM2 config
```

## Database Schema

Voyagr uses a relational multi-tenant schema where every content model includes a `tenantId` foreign key. This ensures complete data isolation between tenants at the database level.

**Core models:**

| Model | Purpose |
|-------|---------|
| `User` | Registered accounts with email + bcrypt password hash |
| `Tenant` | A tenant (travel brand) with slug, custom domain, theme selection |
| `Membership` | Join table linking users to tenants with a role (Owner, Admin, Editor) |
| `Page` | Static pages with rich HTML content, slug, SEO fields, publish status |
| `Post` | Blog posts with author, excerpt, featured image, scheduled publishing |
| `Category` | Blog categories scoped per tenant (many-to-many with posts) |
| `Tag` | Blog tags scoped per tenant (many-to-many with posts) |
| `Media` | Uploaded files with metadata (dimensions, MIME type, alt text) |
| `MenuItem` | Navigation entries with position ordering and parent-child nesting |
| `Subscriber` | Newsletter subscribers with email and status |
| `Newsletter` | Email campaigns with subject, HTML content, send status, and sent count |

## Theme System

Voyagr's theme system has three layers:

### 1. Theme Config (`src/lib/themes/registry.ts`)

100 pre-defined theme configurations, each specifying:

- **Colors**: primary, secondary, accent, background, text
- **Fonts**: heading and body font families (loaded from Google Fonts)
- **Layout**: which layout template to use
- **Features**: descriptive tags for the theme

Themes are organized across 20 travel niches: luxury, adventure, backpacker, cruise, cultural, family, safari, urban, wellness, and more.

### 2. Layout Templates (`src/themes/*/`)

15 structural designs that control the visual layout. Each layout exports three components:

- `TenantLayout` -- the outer shell (header, footer, navigation)
- `HeroSection` -- the hero/banner area
- `PageLayout` -- the wrapper for page content

### 3. ThemeProvider (`src/lib/themes/theme-provider.tsx`)

Injects CSS custom properties (colors, fonts) into the page at runtime based on the tenant's selected theme. This means any layout template can be combined with any color/font configuration.

### Creating a New Theme

1. Add a new entry to the `themes` object in `src/lib/themes/registry.ts` with your colors, fonts, and layout choice.
2. Optionally, create a new layout folder under `src/themes/` with `TenantLayout`, `HeroSection`, and `PageLayout` components, then register it in `src/themes/index.ts`.

## API Reference

All API routes are under `/api/` and require authentication unless noted. Tenant scoping is handled automatically via the authenticated user's membership.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up` | Register a new user and create a tenant |

### Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pages` | List all pages for the current tenant |
| POST | `/api/pages` | Create a new page |
| GET | `/api/pages/[id]` | Get a single page |
| PUT | `/api/pages/[id]` | Update a page |
| DELETE | `/api/pages/[id]` | Delete a page |

### Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List all posts for the current tenant |
| POST | `/api/posts` | Create a new post |
| GET | `/api/posts/[id]` | Get a single post |
| PUT | `/api/posts/[id]` | Update a post |
| DELETE | `/api/posts/[id]` | Delete a post |

### Media

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/media` | List all media for the current tenant |
| POST | `/api/media` | Upload a file |
| PATCH | `/api/media/[id]` | Update media metadata (alt text) |
| DELETE | `/api/media/[id]` | Delete a media file |

### Menus

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menus` | Get navigation menu items |
| POST | `/api/menus` | Create a menu item |
| PUT | `/api/menus` | Bulk reorder menu items |
| PUT | `/api/menus/[id]` | Update a menu item |
| DELETE | `/api/menus/[id]` | Delete a menu item |

### Newsletter

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/newsletter/subscribers` | List subscribers |
| POST | `/api/newsletter/subscribers` | Add a subscriber (public) |
| GET | `/api/newsletter/campaigns` | List campaigns |
| POST | `/api/newsletter/campaigns` | Create a campaign |
| GET | `/api/newsletter/campaigns/[id]` | Get a campaign |
| PUT | `/api/newsletter/campaigns/[id]` | Update a campaign |
| POST | `/api/newsletter/campaigns/[id]` | Send a campaign |
| DELETE | `/api/newsletter/campaigns/[id]` | Delete a campaign |

### Team

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/team` | List team members |
| POST | `/api/team` | Invite a team member |
| PUT | `/api/team/[id]` | Update a member's role |
| DELETE | `/api/team/[id]` | Remove a team member |

### Tenant

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tenant/settings` | Get tenant settings |
| PUT | `/api/tenant/settings` | Update tenant settings (theme, domain, etc.) |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string (e.g., `mysql://user:pass@host:3306/voyagr`) |
| `AUTH_SECRET` | Yes | Random secret for JWT signing. Generate with `openssl rand -base64 32` |
| `AUTH_URL` | Yes | Public URL of the app (e.g., `https://voyagr.example.com`) |
| `AUTH_TRUST_HOST` | Yes | Set to `true` when running behind a reverse proxy |
| `NEXT_PUBLIC_ROOT_DOMAIN` | Yes | Root domain for subdomain routing (e.g., `voyagr.example.com`) |
| `NODE_ENV` | Yes | `production` or `development` |
| `PORT` | No | Server port (default: `3000`) |
| `SMTP_HOST` | No | SMTP server hostname for sending newsletters |
| `SMTP_PORT` | No | SMTP server port |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `SMTP_FROM` | No | Sender email address for newsletters |

## Deployment

### Production (VPS / Bare Metal)

```bash
# 1. Install Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs

# 2. Clone and install
git clone https://github.com/your-org/voyagr.git
cd voyagr
npm ci

# 3. Configure environment
cp .env.example .env
# Edit .env with production values (DATABASE_URL, AUTH_SECRET, etc.)

# 4. Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate deploy

# 5. Build the application
npm run build

# 6. Start with PM2
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Docker

See [docs/self-hosting.md](docs/self-hosting.md) for the full guide including backup and restore procedures.

```bash
cp .env.docker .env
# Edit .env with your credentials
docker compose up -d
docker compose exec app npx prisma migrate deploy
```

### DNS Setup

Voyagr requires two DNS records for subdomain-based multi-tenancy:

| Type | Name | Value |
|------|------|-------|
| A | `yourdomain.com` | Your server IP |
| A | `*.yourdomain.com` | Your server IP |

For wildcard SSL certificates, use Cloudflare DNS with the `certbot-dns-cloudflare` plugin:

```bash
sudo apt install certbot python3-certbot-dns-cloudflare
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /etc/cloudflare.ini \
  -d yourdomain.com \
  -d "*.yourdomain.com"
```

### nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com *.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}
```

Then obtain SSL with `sudo certbot --nginx`.

## Demo Content

Run the seed script to populate a tenant with sample content for testing and exploration:

```bash
npm run seed:demo
```

This creates demo pages, blog posts with categories and tags, and navigation menu items -- giving you a fully populated tenant to explore the CMS features immediately.

## Contributing

Contributions are welcome. To get started:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes and ensure they pass linting: `npm run lint`.
4. Commit with a clear message describing the change.
5. Open a pull request against `main`.

Please keep PRs focused on a single concern and include a description of what the change does and why.

## License

MIT
