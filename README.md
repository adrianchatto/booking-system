# BookRight — Multi-Tenant Booking Platform

A full-stack proof of concept booking platform for local service businesses. Built with Next.js 14, Prisma, PostgreSQL, and Claude AI.

---

## What It Does

- **Multi-tenant** — each business gets their own URL (`/bright-windows`, `/shear-perfection`, etc.)
- **AI booking chatbot** — powered by Claude claude-haiku-4-5-20251001, embedded on every tenant site
- **Four industry themes** — sharp, custom-designed for window cleaning, hairdressing, personal training, and plumbing
- **Tenant admin** — each business manages bookings, calendar, customers, and their website content (CMS)
- **Super admin** — platform owner can spin up new tenants, deactivate them, and see platform-wide stats

---

## Demo Credentials

**Super admin:** `superadmin@platform.com` / `SuperAdmin2024!`  
→ Login at `/admin/login`

| Tenant | Slug | Email | Password |
|--------|------|-------|----------|
| Bright Windows | `/bright-windows` | `admin@bright-windows.co.uk` | `BrightWindows2024!` |
| Shear Perfection | `/shear-perfection` | `admin@shear-perfection.co.uk` | `ShearPerfection2024!` |
| Peak Performance PT | `/peak-performance` | `admin@peak-performance.co.uk` | `PeakPerformance2024!` |
| RapidFix Plumbing | `/rapidfix-plumbing` | `admin@rapidfix-plumbing.co.uk` | `RapidFix2024!` |

Tenant admin login at `/{slug}/admin/login`

---

## Local Development

### 1. Clone and install

```bash
git clone <your-repo-url>
cd booking-system
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `DATABASE_URL` — your PostgreSQL connection string
- `NEXTAUTH_SECRET` — run `openssl rand -base64 32` and paste the output
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)

### 3. Set up the database

```bash
# Push the schema (creates all tables)
npm run db:push

# Seed with demo data
npm run db:seed
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Render

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/bookright.git
git push -u origin main
```

### Step 2 — Create a new Render project

1. Go to [render.com](https://render.com) and log in
2. Click **New** → **Blueprint**
3. Connect your GitHub repository
4. Render will detect `render.yaml` and configure everything automatically

### Step 3 — Set environment variables

In your Render web service settings, add:
- `ANTHROPIC_API_KEY` — your Claude API key

Everything else (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) is handled automatically by `render.yaml`.

### Step 4 — Deploy

Render will build and deploy automatically. The first deploy runs `db:push` and seeds the database.

**Important:** After the first deploy, remove `npm run db:seed` from the build command to avoid re-seeding on every deploy:

```yaml
buildCommand: npm install && npx prisma generate && npx prisma db push && npm run build
```

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Platform marketing homepage
│   ├── admin/                      # Super admin portal
│   │   ├── login/page.tsx
│   │   └── dashboard/page.tsx
│   ├── [slug]/                     # Tenant public sites
│   │   ├── page.tsx                # Loads correct theme
│   │   └── admin/                  # Tenant admin portal
│   │       ├── login/page.tsx
│   │       └── dashboard/
│   │           ├── page.tsx        # Overview
│   │           ├── bookings/       # Booking management
│   │           ├── calendar/       # Week view + block slots
│   │           ├── customers/      # Customer database
│   │           └── settings/       # CMS + services
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth
│       ├── chat/                   # Claude chatbot (streaming)
│       ├── bookings/               # Booking CRUD
│       ├── tenants/                # Tenant management
│       ├── services/               # Service management
│       ├── customers/              # Customer records
│       ├── availability/           # Time slot availability
│       └── blocked-slots/          # Calendar blocking
├── components/
│   ├── ChatBot.tsx                 # Floating chat widget
│   ├── BookingModal.tsx            # Manual booking flow
│   └── themes/
│       ├── WindowCleanerTheme.tsx
│       ├── HairdresserTheme.tsx
│       ├── PersonalTrainerTheme.tsx
│       └── PlumberTheme.tsx
├── lib/
│   ├── prisma.ts                   # Prisma singleton
│   ├── auth.ts                     # NextAuth config
│   └── utils.ts                    # Helpers
└── types/index.ts
```

---

## Adding a New Tenant

Via the super admin dashboard (`/admin/login`):
1. Click **New Tenant**
2. Enter business name, URL slug, type, and admin credentials
3. Hit **Create** — the tenant is live immediately

Or via the API:
```bash
curl -X POST /api/tenants \
  -H 'Content-Type: application/json' \
  -d '{"businessName":"My Business","slug":"my-business","type":"PLUMBER","adminEmail":"admin@my-business.com","adminPassword":"password123"}'
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL via Prisma |
| Auth | NextAuth.js (JWT) |
| AI | Anthropic Claude claude-haiku-4-5-20251001 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Deployment | Render |
