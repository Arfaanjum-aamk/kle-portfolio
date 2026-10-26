# Engineering Portfolio Studio — KLE Technological University

Portfolio platform for Mechanical Engineering students and faculty (School of Mechanical Engineering, Hubballi).
Stack: React + Vite + TypeScript, Tailwind, Supabase (Auth, Postgres, Storage), GitHub Actions + GitHub Pages.

## Build status (honest checklist)

| Phase | Scope | Status |
|---|---|---|
| 1 | Design system, login/registration with the college photo, password reset, email verification flow, routing, GitHub Pages config | Implemented. Type-check, 14 unit tests and build pass; pages checked in screenshots at desktop and mobile widths |
| 2 | Profiles, roles, signup trigger, RLS, email-domain restriction | `supabase/migrations/0001` written. **Not yet run against a real Supabase project**, so sign-in, registration and RLS are untested end to end |
| 2 (rest) | Remaining tables, storage buckets and policies | Not started |
| 3 | Student dashboard, project builder, theme editor | Not started (dashboards are empty shells with no sample data) |
| 4 | S1–S11 workflow, uploads, video, CAD viewer | Not started |
| 5 | Simulations, calculations, logbook, graphs | Not started |
| 6 | Public portfolios and publishing | Route exists so deep links work; content not started |
| 7 | Faculty review | Not started |
| 8 | Security review, full test suite, deployment verification | Workflow written, **not yet run on GitHub** |

## 1. Run locally

```bash
npm install
cp .env.example .env     # then fill in the values (section 2)
npm run dev
```

Scripts: `npm run typecheck`, `npm test`, `npm run build`.

## 2. Supabase setup

1. Create a project at supabase.com.
2. Project Settings → API: copy the **Project URL** and the **publishable (anon) key** into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Never use the service-role key in this repo.
3. SQL Editor: run `supabase/migrations/0001_auth_profiles_roles.sql`.
4. Authentication → URL Configuration:
   - Site URL: your deployed URL, e.g. `https://<your-username>.github.io/<your-repository>/`
   - Redirect URLs: add the same URL with `/**`, plus `http://localhost:5173/**` for local work.
5. Authentication → Providers → Email: keep **Confirm email** enabled.
6. Storage buckets and policies: added in later phases.

### Email domain restriction

Set `VITE_ALLOWED_EMAIL_DOMAINS` (comma separated, e.g. `kletech.ac.in`) for client-side hints, and enforce it on the server:

```sql
update public.platform_settings set allowed_email_domains = array['kletech.ac.in'];
```

The server check blocks signups from other domains even if the client is bypassed. Leave both empty to allow any domain.

### Faculty and admin roles

Public registration only ever creates **students**. The role is never read from signup data, and signed-in users cannot change it (a database trigger blocks it). To grant a role, run this in the Supabase SQL Editor, which runs without a user session and is the trusted path:

```sql
update public.profiles set role = 'faculty'
where id = (select id from auth.users where email = 'person@kletech.ac.in');
```

The first administrator is created the same way (`'admin'`). Afterwards admins can call `select public.set_user_role('<user-uuid>', 'faculty');` from an authenticated session.

## 3. Deploy to GitHub Pages

1. Push to a GitHub repository (default branch `main`).
2. Settings → Pages → Source: **GitHub Actions**.
3. Settings → Secrets and variables → Actions → **Variables**: add `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and optionally `VITE_ALLOWED_EMAIL_DOMAINS`. These are public by design.
4. Push. `.github/workflows/deploy.yml` type-checks, tests, builds with `VITE_BASE_PATH=/<repository-name>/` (taken from the repository, nothing hardcoded) and deploys.

Deep links and refresh: the build copies `index.html` to `404.html`, so a URL like `/<repo>/student/jane` boots the app and React Router resolves it.

## 4. The college photo

`src/assets/kletu-school-of-mechanical-engineering.webp` is your supplied photo, unmodified (794×550). `kletu-school-mobile-crop.webp` is a plain crop of it for narrow screens (no resampling). Because the original is small, it looks slightly soft on large desktop screens; swap in a higher-resolution original of the same photo if you have one.

## 5. Testing authentication (once Supabase is configured)

1. Register with a test address, open the verification email link, then sign in.
2. Confirm the new profile row has `role = 'student'`.
3. From the browser console, try updating your own profile's `role` to `admin` with the Supabase client: it must fail.
4. Use "Forgot password", follow the email link and set a new password.

## Troubleshooting

- **Blank page or asset 404s on Pages**: `VITE_BASE_PATH` must be `/<repository-name>/` (the workflow sets it).
- **"Supabase is not configured" banner**: `.env` is missing, or the dev server was not restarted after editing it.
- **Verification link lands on the wrong site**: fix Site URL and Redirect URLs in Supabase.
- **"Database error saving new user"**: the email domain is not allowed, or the migration has not been run.
