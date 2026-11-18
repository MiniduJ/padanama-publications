# Padanama Publications — Production Deployment & Operations Runbook

**Document:** `docs/runbooks/production-deployment.md`  
**Primary Domain:** `padanamapublication.lk`  
**Platform Version:** 1.0.0  
**Environment:** Production  
**Date:** November 2026  

---

## 1. Domain & DNS Configuration

Padanama Publications utilizes the official existing domain: **`padanamapublication.lk`**.

### Required DNS Records (LK Domain Registry / Cloudflare)

| Type | Name | Target / Value | TTL | Purpose |
|---|---|---|---|---|
| **A** | `@` | `76.76.21.21` (or production host IP) | Auto | Apex domain routing |
| **CNAME** | `www` | `cname.vercel-dns.com` (or proxy target) | Auto | Canonical www redirect |
| **TXT** | `@` | `v=spf1 include:_spf.google.com ~all` | 3600 | SPF Email Authentication |
| **TXT** | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@padanamapublication.lk` | 3600 | DMARC Anti-Spoofing |
| **CNAME** | `payhere` | Custom CNAME if white-labeling | 3600 | Gateway verification |

---

## 2. Production Environment Variables Inventory

Copy `.env.example` to `.env.production` on the production server or Vercel dashboard:

```env
# Application Core
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://padanamapublication.lk
PORT=3000

# Database Connection (PostgreSQL / Supabase / Neon / Cloud SQL)
DATABASE_URL="postgresql://padanama_prod:STRONG_PASSWORD_HERE@db.padanamapublication.lk:5432/padanama_db?schema=public&sslmode=require"

# PayHere Online Payment Gateway (Live Merchant Credentials)
PAYHERE_MERCHANT_ID="1211111"
PAYHERE_MERCHANT_SECRET="LIVE_MERCHANT_SECRET_HERE"
PAYHERE_MODE="live"
PAYHERE_NOTIFY_URL="https://padanamapublication.lk/api/webhooks/payhere"

# SMS Lenz Gateway (+94 Sri Lankan Gateway)
SMSLENZ_API_KEY="LIVE_SMSLENZ_TOKEN_HERE"
SMSLENZ_SENDER_ID="Padanama"
SMSLENZ_API_URL="https://smslenz.lk/api/v1/sms/send"

# Courier Integration
DOMEX_API_KEY="DOMEX_MERCHANT_KEY"
DOMEX_MERCHANT_CODE="PDN-001"

# Security & Session Authentication
NEXTAUTH_SECRET="REPLACE_WITH_HEX_64_CHARACTER_RANDOM_SECRET"
NEXTAUTH_URL="https://padanamapublication.lk"

# Storage Bucket (Cloudflare R2 or AWS S3 for PDF master e-books and bank slips)
R2_ACCOUNT_ID="CLOUDFLARE_R2_ACCOUNT_ID"
R2_ACCESS_KEY_ID="CLOUDFLARE_R2_KEY"
R2_SECRET_ACCESS_KEY="CLOUDFLARE_R2_SECRET"
R2_BUCKET_NAME="padanama-assets"
```

---

## 3. Deployment Steps

### Method A: Vercel / Cloudflare Pages (Recommended)
1. Link GitHub repository `padanama-publications` on Vercel.
2. Set Framework Preset: `Next.js`.
3. Set Build Command: `npm run build`.
4. Add production environment variables in project settings.
5. In Domains, attach `padanamapublication.lk` and `www.padanamapublication.lk`.
6. Trigger production deployment.

### Method B: Self-Hosted Docker / Linux VPS
```bash
# 1. Clone repository
git clone https://github.com/padanama/padanama-platform.git /var/www/padanama
cd /var/www/padanama

# 2. Install dependencies & build
npm ci
npm run prisma:generate
npx prisma migrate deploy
npm run build

# 3. Start PM2 process manager
pm2 start npm --name "padanama-web" -- start
pm2 save
pm2 startup
```

---

## 4. Database Maintenance & Daily Backups

Set up a daily automated cron job on the database server at 02:00 AM Sri Lanka Standard Time:

```bash
#!/bin/bash
# /opt/scripts/backup-db.sh
BACKUP_DIR="/var/backups/padanama"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR

# Dump PostgreSQL database
pg_dump -U padanama_prod -h localhost padanama_db | gzip > $BACKUP_DIR/padanama_backup_$TIMESTAMP.sql.gz

# Retain last 30 daily backups
find $BACKUP_DIR -name "padanama_backup_*.sql.gz" -mtime +30 -delete
```

### Database Restore Procedure
```bash
gunzip -c /var/backups/padanama/padanama_backup_TIMESTAMP.sql.gz | psql -U padanama_prod -h localhost padanama_db
```

---

## 5. Security & Secrets Rotation Procedure

### Rotating PayHere Live Secret
1. Log into PayHere Merchant Portal (`www.payhere.lk`).
2. Navigate to Settings $\to$ Domains & Credentials.
3. Click "Regenerate Merchant Secret".
4. Immediately update `PAYHERE_MERCHANT_SECRET` in production environment variables.
5. Redeploy / restart Next.js instance without downtime.
6. Verify `/api/webhooks/payhere` with a live LKR 100 test transaction.

### Rotating SMS Lenz API Key
1. Log into `smslenz.lk` management dashboard.
2. Generate new API token under API Tokens.
3. Update `SMSLENZ_API_KEY` in environment variables.
4. Test OTP dispatch via `/api/auth/otp/request`.
