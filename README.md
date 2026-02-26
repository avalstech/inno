# Inno Anene Website (Vite + React + Tailwind)

A clean, production-ready personal brand site for **Innocent (Inno) Anene, MSc, PMP**.

## Quick start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Customize

Update these first:
- `index.html` (title/description)
- `src/App.tsx` (hero copy, location, contact details)
- `public/og.svg` + `public/favicon.svg`

## Deploy

This is a standard Vite SPA. You can deploy to:
- AWS Amplify Hosting
- Netlify
- Vercel
- CloudFront + S3

If you deploy under a sub-path, ensure your hosting rewrites all routes to `index.html` (SPA fallback).
