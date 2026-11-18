# Padanama Publications (පදනම ප්‍රකාශන)

> Production-ready, trilingual (Sinhala / English / Tamil), mobile-first website, e-commerce platform, digital sample reader, and unified administrative console for **Padanama Publications**, an educational and literary publisher in Sri Lanka.

---

## 🌟 Key Platform Innovations

1. **Trilingual from Day One:** Native locale routing for Sinhala (`/si` as default), English (`/en`), and Tamil (`/ta`) powered by `next-intl`.
2. **In-Browser Digital Reader & Paywall:** Instant distraction-free sample preview reading (PDF.js / EPUB) with configurable page/chapter limits, converting seamlessly to physical or digital purchases.
3. **Singlish Phonetic Search:** Instant transliteration engine mapping phonetic Latin typing (`"madol duwa"` $\to$ `"මඩොල් දූව"`, `"ganithaya 10"` $\to$ `"ගණිතය 10"`) for mobile shoppers.
4. **Sri Lankan Payment Infrastructure:** Cryptographically verified PayHere gateway (Visa, Mastercard, eZ Cash, Genie, FriMi), Koko BNPL (3-month split payments), Bank Deposit with slip image upload & admin verification, and Cash on Delivery (COD).
5. **25-District Automated Shipping:** Dynamic shipping rate calculation across all 9 provinces and 25 districts with courier tracking integration (Domex / Koombiyo).
6. **Unified Role-Guarded Admin:** Code-split, lazy-loaded administrative panel operating within the same Next.js application at `/admin`, protected by RBAC and mandatory 2FA.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, React 19) + TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS + CSS Variables (Sri Lankan Cultural Palette) |
| **Database** | PostgreSQL 16 (Local Docker or Supabase / Neon) |
| **ORM** | Prisma ORM 6 (35+ relational domain models) |
| **Localization** | `next-intl` (Sinhala `/si`, English `/en`, Tamil `/ta`) |
| **Payments** | PayHere (MD5 signature verification), WebXPay, Koko BNPL, Bank Slips |
| **SMS Gateway** | SMS Lenz (`smslenz.lk`) for +94 OTP and order dispatch |
| **Storage** | Cloudflare R2 / AWS S3 (Private buckets for DRM-lite content) |
| **Testing** | Vitest (Unit) + Playwright (E2E & a11y) |
| **Containerization** | Docker Compose (PostgreSQL 16 & Redis 7) |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v22.x or v24.x
- **Docker Desktop:** Installed and running

### 2. Environment Setup
Clone the repository and copy the environment template:
```bash
cp .env.example .env
```

### 3. Start Local Database (PostgreSQL & Redis)
```bash
docker compose up -d
```

### 4. Install Dependencies & Seed Database
```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Storefront:** [http://localhost:3000/si](http://localhost:3000/si)
- **English Storefront:** [http://localhost:3000/en](http://localhost:3000/en)
- **Tamil Storefront:** [http://localhost:3000/ta](http://localhost:3000/ta)
- **Admin Console:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Health Diagnostics:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🧪 Testing & Verification

Run the automated Vitest test suite:
```bash
npm run test
```

Run TypeScript compilation check:
```bash
npm run typecheck
```

Build for production:
```bash
npm run build
```

---

## 📁 Repository Structure

```
├── .github/workflows/       # GitHub Actions CI/CD pipelines
├── docs/
│   ├── adr/                 # Architecture Decision Records (ADRs)
│   ├── architecture/        # High-level architecture & Mermaid ERDs
│   ├── phases/              # Phase plans and exit-gate sign-off reports
│   └── research/            # Competitor analysis, local context, personas
├── messages/                # Trilingual translation dictionaries (si, en, ta)
├── prisma/                  # Prisma schema, migrations, and seed script
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (store)/     # Public storefront pages (Home, Catalog, Book detail)
│   │   │   ├── (account)/   # Customer portal (Orders, Saved addresses, My Library)
│   │   │   └── (reader)/    # Digital library & in-browser free-sample reader
│   │   ├── admin/           # Unified administrative console (code-split, RBAC)
│   │   └── api/             # Webhooks (PayHere, Koko), health check, reader stream
│   ├── i18n/                # next-intl routing and request configuration
│   ├── lib/                 # Shared utilities (Money, Transliteration, Styling)
│   ├── middleware.ts        # Route-level security & trilingual middleware
│   └── server/              # Database singleton, Payment & SMS adapters
├── docker-compose.yml       # Local PostgreSQL & Redis container setup
├── package.json             # Scripts & dependencies
└── tailwind.config.ts       # Sri Lankan cultural color tokens & typography
```

---

## 📄 License
Private & Confidential — Padanama Publications (පදනම ප්‍රකාශන). All Rights Reserved.
