# Doughlight Bakehouse — React Replica

Inspired by https://baristi.framer.website/ (Home, About, Contact). Built with React + Vite + Tailwind CSS.

The layout, section order, pacing and playful bakery vibe follow the reference. All copy, brand name, colours and code are original placeholders.

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for Production

```bash
npm run build
```

## Project Structure

- `src/pages/` — Home, About, Contact
- `src/components/` — Navbar, Footer, Marquee, FAQ, carousel and other shared UI
- `src/data.js` — menu items, FAQs, image IDs and currency symbol (change `currency` to switch from `$`)
- `src/index.css` — design tokens (colours and fonts as CSS variables)

## Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2 — GitHub + Vercel Dashboard
1. Push this project to a GitHub repo
2. Go to https://vercel.com/new
3. Import your repo
4. Framework preset: **Vite**
5. Click **Deploy** — done!

`vercel.json` already contains the SPA rewrite so `/about` and `/contact` work on refresh.

## Notes

- Photos load from Unsplash with an automatic fallback to placeholder images. Swap in your own brand photography via `src/data.js`.
- The contact form is front-end only. Connect it to Formspree, Resend, or your own API in `src/pages/Contact.jsx`.

## Tech Stack
- React 18
- Vite 5
- Tailwind CSS 3
- Framer Motion
- Lucide React
- React Router 6
