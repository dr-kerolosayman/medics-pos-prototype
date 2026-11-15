# Deploying this prototype on Lovable

The app is a standard **Vite + React 18** project. Lovable runs Vite/React natively, so it can host it as-is — no rewrites needed.

## Option A — Import from GitHub (recommended, ~3 minutes)

1. Create an empty repo on GitHub (e.g. `medics-pos-prototype`).
2. From this folder:
   ```bash
   git init
   git add .
   git commit -m "MEDICs POS interactive prototype"
   git branch -M main
   git remote add origin https://github.com/<your-user>/medics-pos-prototype.git
   git push -u origin main
   ```
3. In Lovable: **New project → Import from GitHub →** pick the repo → **Import**.
4. Lovable detects `package.json`, installs, and serves `npm run dev`. Click **Publish** to get the live URL.

## Option B — Paste the code into a blank Lovable project

1. Lovable → **New project** → blank.
2. In the chat, paste the prompt below so Lovable does not overwrite the design.
3. Open the **Code** view (top-right `< >`) and replace these files with the ones from this project:
   - `index.html`, `vite.config.js`, `package.json`
   - `src/main.jsx`, `src/App.jsx`, `src/data.js`, `src/styles.css`
   - `src/components/Shell.jsx`, `src/components/Phone.jsx`
   - `src/screens/Login.jsx`, `src/screens/Pos.jsx`, `src/screens/Invoice.jsx`
   - `src/assets/logo.png`, `src/assets/doctor.png`
4. Delete Lovable's default `src/App.css`, `src/index.css`, `src/pages/*` if they exist, and make sure `main.jsx` imports `./styles.css`.
5. Click **Publish**.

### Prompt to paste first

```
This project is a pixel-accurate interactive prototype of a Windows desktop POS app.
Do NOT redesign anything, do not add Tailwind, do not restyle components.
Keep the exact file structure I provide (Vite + React 18 + plain CSS + lucide-react).
All layout is drawn on a fixed 1600x1000 canvas scaled with a CSS transform; keep it.
Arabic UI is RTL with the Cairo font; the EN toggle switches strings and direction.
Just install dependencies, run the dev server and let me replace the files.
```

## Dependencies

```json
"react": "^18.3.1",
"react-dom": "^18.3.1",
"lucide-react": "^0.454.0",
"vite": "^5.4.10",
"@vitejs/plugin-react": "^4.3.3"
```

Fonts are loaded from Google Fonts in `index.html` (Cairo 400–800). If the venue Wi-Fi blocks it, the app falls back to Segoe UI / Tahoma automatically.

## If Lovable's import fails during the hackathon

Any static host works, because `npm run build` produces a plain `dist/` folder:

```bash
npm run build
npx serve dist          # or: python3 -m http.server 8080 -d dist
```

Then drag `dist/` into Netlify Drop, Vercel, or Surge (`npx surge dist`). All of these give a public URL in under a minute.
