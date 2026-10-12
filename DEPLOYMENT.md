# Deployment Guide — hariomchauhan.com.np portfolio

This covers the free-tier stack used by the portfolio:

| Layer | Service | Cost |
|---|---|---|
| Frontend (React + Vite) | Netlify | Free |
| API (Express) | Render free web service | Free (750 instance-hours/mo) |
| Database | MongoDB Atlas M0 | Free (512 MB) |
| Image storage (optional) | Cloudinary Basic | Free (25 GB storage / 25 GB bandwidth) |

```
Browser ──▶ Netlify (https://hariomchauhan.com.np)
              │
              ▼  /api/* = 200 rewrite (same-origin, no CORS)
           Render API
              │
              ├── MongoDB Atlas (M0)     ← content, admins
              └── Cloudinary (optional)  ← uploaded images
```

Browsers only ever talk to Netlify. Netlify rewrites `/api/*` to Render behind the
scenes, so relative image URLs like `/api/images/<id>` keep working and CORS is
not involved. Cloudinary images are returned as full CDN URLs, so image bandwidth
never touches Netlify or Render.

---

## Prerequisites

- A [GitHub](https://github.com) account with this repo pushed to it.
- The `main` branch is clean: `npm run check` from the repo root passes.
- A `.np` domain: `hariomchauhan.com.np` (registered via the Nepal registry).

---

## Step 1 — Cloudinary (optional, recommended)

Without credentials the API silently stores images as base64 in MongoDB. That
works, but it inflates the database and serves images through Render's 512 MB.
Cloudinary gives free 25 GB storage and 25 GB bandwidth per month.

1. Sign up at <https://cloudinary.com/signup> (free "Basic" plan, no card).
2. Dashboard → **Access Keys** / **API Keys**: copy three values:
   - `CLOUDINARY_CLOUD_NAME` — e.g. `dxxxxxxxxx`
   - `CLOUDINARY_API_KEY` — a numeric string
   - `CLOUDINARY_API_SECRET` — a long random string
3. Keep them ready for Step 3. Entering them in Render and leaving them out of
   git keeps the account safe; the API only uses them server-side.

---

## Step 2 — MongoDB Atlas M0

1. Sign in at <https://www.mongodb.com/atlas> and create a free M0 cluster (512 MB).
2. Database Access → add a database user with a strong password.
3. Network Access → allow `0.0.0.0/0` (Render's egress IPs are dynamic; the
   connection string is protected by the password).
4. Connect → copy the `mongodb+srv://<user>:<password>@cluster...` URI.
   Make sure the URI includes the database name (append `/?retryWrites=true&w=majority`
   if it is missing).

---

## Step 3 — Render (the API)

The repository ships a `render.yaml` Blueprint, so Render creates everything for
you.

1. Go to <https://dashboard.render.com> → **New +** → **Blueprint**.
2. Pick this repo. Render reads `render.yaml`, creates the web service
   `hariom-portfolio-api` (root `backend`, Node, free plan) and opens a prompt
   for the `sync: false` secrets.
3. Enter the secrets (never committed to git):
   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Atlas connection string from Step 2 |
   | `JWT_SECRET` | Random string ≥32 chars: `openssl rand -hex 32` |
   | `GITHUB_TOKEN` | Optional; fine-grained token, read-only repo metadata |
   | `CLOUDINARY_CLOUD_NAME` | From Step 1 |
   | `CLOUDINARY_API_KEY` | From Step 1 |
   | `CLOUDINARY_API_SECRET` | From Step 1 |
4. Deploy. When it is live, Render shows a URL like
   `https://hariom-portfolio-api.onrender.com`. Verify:
   ```bash
   curl https://hariom-portfolio-api.onrender.com/api/health
   # {"status":"OK","database":"connected","imageStorage":"cloudinary"}
   ```
   `imageStorage` shows `cloudinary` only when all three Cloudinary keys were set.

### Free tier realities

- Render free spins down after **15 minutes idle** and takes ~60 s to cold start.
  The first request after a pause will be slow.
- To keep it warm, add a free [UptimeRobot](https://uptimerobot.com) monitor
  pinging `/api/health` every 5 minutes. This costs you ~8 instance-hours/day
  (about 250 of your 750 free hours/month).
- Render's filesystem is ephemeral — never store files on disk.

---

## Step 4 — Netlify (the frontend)

The repo ships `netlify.toml` with build settings (`npm run build`, publish `dist`,
Node 20) and the `/api/*` proxy.

1. **Edit `netlify.toml` first**: replace the placeholder proxy host
   `https://REPLACE-WITH-YOUR-SERVICE.onrender.com/api/:splat` with your real
   Render URL. Commit and push.
2. Sign in at <https://app.netlify.com> → **Add new site** → **Import from Git**
   → pick the repo.
3. Netlify reads `netlify.toml` automatically — build command and publish
   directory are prefilled; do not override them.
4. Deploy. After it finishes you get a `*.netlify.app` URL for the dashboard
   preview.

### Caveats

- Netlify's proxied rewrites time out after **30–40 s** (not configurable). A
  Render instance that is still cold-starting can therefore return a 502/504 on
  the very first request. The `{ "status": 200 }` rewrite is a long-lived
  connection, so keep-warm monitoring (Step 3) prevents most of this.
- Deploy previews get a `https://<hash>--<site>.netlify.app` origin. These are
  already allowed by the CORS wildcard in `render.yaml`
  (`https://*.netlify.app`), so previewing works without extra config.

---

## Step 5 — DNS for hariomchauhan.com.np

`.com.np` domains are delegated through the Nepal registry's DNS management
panel. Two routes:

**Option A — Netlify DNS (recommended)**
1. <https://app.netlify.com> → your site → **Domain settings** → add the domain.
2. Netlify shows two name servers (e.g. `dns1.p01.nsone.net`).
3. In the registry panel change the name servers to those two.
4. Back in Netlify, set the apex to your Netlify site and
   `www → <site>.netlify.app` as a CNAME alias. Netlify issues the TLS cert.

**Option B — external DNS**
Keep DNS at the registry, add:
- `A` record → `75.2.60.5` (Netlify load balancer)
- `CNAME` `www` → `<site>.netlify.app`
and enable **Domain → HTTPS** in Netlify for the certificate.

`www.hariomchauhan.com.np` is already used by the backend's CORS allowlist /
`render.yaml`, so both records are expected.

Verify propagation:
```bash
dig +short hariomchauhan.com.np
curl -sI https://hariomchauhan.com.np | head -1
```

---

## Step 6 — First admin account

The app ships with no admin. Registration is allowed exactly once, until the
first admin exists.

```bash
curl -X POST https://hariomchauhan.com.np/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_USERNAME","password":"YOUR_LONG_PASSWORD"}'
# 201 {"message":"Admin created successfully"}
```

- Username: 3–40 chars (lowercased). Password: **12–128** chars
  (the login form enforces this minimum).
- A second call returns `403 Admin registration is closed`.
- `GET /api/auth/setup-status` returns `{ "needsSetup": false }` once created.
- You can always reset by deleting the `admins` collection in Atlas and
  repeating the curl.

Then sign in at <https://hariomchauhan.com.np/admin>.

---

## Maintenance

- **Local verification**: `npm run check` (frontend build + backend syntax).
- **Local dev**: `npm run dev` (Vite) + `npm --prefix backend run dev`
  (Express on :5000); Vite proxies `/api` to it automatically.
- **Secrets**: all three services keep secrets in their dashboards; nothing
  beyond `.env.example` / `render.yaml` placeholders is committed.
- **Updating**: push to `main` → Netlify and Render auto-deploy. Render's
  SIGTERM handler drains in-flight requests, so deploys don't drop responses.
```