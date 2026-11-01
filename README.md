# Habitly – Personal Health & Habit Tracker

Habitly is a dark-mode habit and health tracker. Log water, sleep, steps, exercise, meals, screen time, mood and stress each day, build your own habits with daily targets and reminders, see weekly and monthly analytics, and print a health summary for your doctor. All data stays in your browser (localStorage).

## Tech stack

- **React 19** (function components, hooks, Context API)
- **Vite 7** with `@vitejs/plugin-react` (dev server and production build)
- **Plain CSS** (`src/index.css`, `src/App.css`) with CSS variables
- **Inline SVG** charts (ring, bar and line charts, no chart library)
- **Browser APIs**: localStorage, Web Crypto (SHA-256), Notifications, `window.print()`
- **Google Fonts**: Archivo and IBM Plex Mono
- **oxlint** for linting

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # preview the production build
npm run lint
```

Requires Node.js 18 or newer.

## Project structure

```
public/            favicon
src/
  components/      Landing, Sidebar, Dashboard, Habits, Profile, Analytics, Reports, Charts, Toast
  context/         AppContext (app state, saving, toasts, reminders)
  hooks/           useHash (hash-based routing)
  utils/           dates, storage, metrics and scoring, profile form fields, recommendations
  App.jsx          layout and routing
  App.css          layout, charts, calendar, responsive and print styles
  index.css        design tokens, typography, buttons, forms
  main.jsx         entry point
index.html         Vite HTML entry
```

## Notes

Accounts and data live only on the device that created them. Habitly gives general wellness information and is not medical advice.
