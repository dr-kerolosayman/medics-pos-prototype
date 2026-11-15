# Migration package — what's inside and what isn't

**Target:** Lovable (Vite + React import).

## Included

| Category | Files |
|---|---|
| Frontend code | `index.html`, `src/main.jsx`, `src/App.jsx`, `src/data.js`, `src/styles.css`, `src/components/*`, `src/screens/*` |
| Assets | `src/assets/logo.png`, `src/assets/doctor.png`, `screenshots/*.png` |
| Dependency files | `package.json`, `package-lock.json` |
| Configuration | `vite.config.js`, `.gitignore` |
| Environment template | `.env.example` (all values blank) |
| Database | `db/schema.sql` — reference model only, see below |
| Docs | `README.md`, `LOVABLE_PROMPT.md`, this file |

## Not included (does not exist in this project)

- **Backend code.** There is none. The prototype is a pure frontend; every number, product and invoice row is mock data in `src/data.js`. The original MEDICs system is C# / .NET + PostgreSQL, but that codebase was not part of this build.
- **Database migrations.** `db/schema.sql` is a reference schema that documents the data model the screens imply. It is **not executed by the app** and changes nothing at runtime. No migration framework is configured.
- **Database records.** None exported, as requested. There is no database to export from.
- **Secrets, credentials, `.env` files, password hashes, tokens.** None exist in the project and none are in this archive. `.env.example` lists variable *names* with blank values.
- **`node_modules/` and `dist/`.** Excluded; `npm install` regenerates them.

## Why `.env.example` is mostly optional

The prototype needs **zero** environment variables to run — `npm install && npm run dev` is enough. The names in `.env.example` are the ones you will need *if* you later connect a real API, auth or the Medics Mobile phone bridge. Until then, leave them unset.

## When you do add a backend

Suggested order, so the screens keep working while you build:

1. Stand up the PostgreSQL schema from `db/schema.sql`.
2. Add an API and set `VITE_API_BASE_URL`.
3. Replace the mock arrays in `src/data.js` with fetches — the component props and shapes are already aligned with the schema, so the UI does not need to change.
4. Swap the prototype's pass-through login for real auth, and store `password_hash` only in the database.

## Verify the package

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # production output in dist/
```
