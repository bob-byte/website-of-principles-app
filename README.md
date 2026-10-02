# Principles — marketing site

Static marketing website and account settings for the **Principles** mobile app. Built with **React** and **Vite**.

Production: https://principles.top

**Full documentation (UK):** [docs/SITE.md](docs/SITE.md)

## Quick start

```bash
yarn install
cp .env.example .env.local
yarn dev
yarn build
```

## Project structure

- `public/` — robots.txt, sitemap.xml, static assets
- `scripts/legal-source/` — archived legal .cshtml for regeneration
- `src/api/` — account deletion API client
- `src/components/` — UI (header, landing sections, settings form)
- `src/config/` — SEO, store links
- `src/content/legalDocuments.js` — legal page HTML (generated)
- `src/locale/` — translations (EN/UK) and themes
- `src/pages/` — Privacy, User Agreement, Settings
- `src/styles/App.css` — global styles and theme variables
- `vite/deleteAccountPlugin.js` — dev server helpers for deletion flow

## Routing (no React Router)

`App.jsx` reads `window.location.pathname`:

| URL | Component |
|-----|-----------|
| `/` | `GetStarted` (landing) |
| `/privacypolicy` | `PrivacyPolicyPage` |
| `/useragreement` | `UserAgreementPage` |
| `/settings` | `SettingsPage` |

## Landing page

`GetStarted` → Hero, Benefits, Steps, Reviews, Final CTA with store buttons (Play/App Store). Header: nav, theme, language, Get started scrolls to download buttons.

## i18n and themes

`LocaleProvider` + `translations.js`. Themes: dark-orange, dark-blue, light-orange, light-blue (CSS variables, localStorage). Default when unset: orange accent, dark/light from `prefers-color-scheme`. Flutter opens site links with `?theme=` (e.g. `dark-orange`) to sync.

## Legal pages

`LegalPage.jsx` renders `legalDocuments.js`. Regenerate: `yarn legal:generate`

## SEO

`SeoHead.jsx`, `config/seo.js`, `public/robots.txt`, `public/sitemap.xml`. Set `VITE_SITE_URL`.

## Account deletion

1. Email + password + confirm
2. API sends 6-digit code to email (`GET /api/account/code`)
3. Password verified (`POST /api/account/authorization`, AES encrypted)
4. User enters code in modal
5. `DELETE /api/account`

Keys in `.env.local` must match the backend encryption keys (`SET.WebAPI` / server env). Use quoted values if keys contain `#` or `%`.

Dev: Vite proxies `/api` to `VITE_API_PROXY_TARGET`.

## Related repos

- [flutter-frontend-of-principles](https://github.com/bob-byte/flutter-frontend-of-principles) — primary Flutter client
- Nested `backend/` (or separate WebAPI clone) — `SET.WebAPI` REST API
- [maui](https://github.com/bob-byte/maui) — older .NET MAUI client (still shipping in stores)
