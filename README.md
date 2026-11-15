# MEDICs POS — Interactive Prototype

Pixel-matched, fully interactive web prototype of the MEDICs desktop POS (C# WinForms + AntdUI 2.4.3) rebuilt as a React app.

## Screens included

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 1 | Login | `login` | Username / password / remember me / Smart Card, MEDICs wordmark, feature strip |
| 2 | POS — Sales (Arabic RTL) | `sales` | Cart table, live totals, payment methods, summary, confirm payment |
| 3 | POS — Sales (English LTR) | `sales` + EN toggle | Same layout, mirrored text direction (matches your English reference) |
| 4 | Inventory — Receive invoice (waiting) | `inventory` | 3-step stepper, waiting illustration, connection methods, phone panel |
| 5 | Inventory — Receive invoice (review) | `inventory` after linking | Invoice header grid, 7-item table with status colours, actions |

## Interactive behaviour

- **Login → POS**: click *Login* or *Smart Card*.
- **Search & add**: type in the search field (`cata`, `pan`, `aug`…) → click a suggestion or press Enter. The row is added and totals recalculate.
- **Quantity**: click any row to select it, then use the input spinner or type. Line totals, "price before discount", item count and grand total update live.
- **Payment method**: Cash / Card / Delivery / Later toggle.
- **Confirm payment**: opens the receipt modal → *New order* clears the cart and shows the empty state (scanner illustration).
- **Inventory tab** (or *Smart Supply* in the rail) → waiting screen.
- **ربط الهاتف / Link Phone**: the phone goes `Disconnected → Connected`, the progress bar fills, items are recognised one by one, then the app moves to the review screen automatically.
- **تأكيد الاستلام**: success toast. **إلغاء الاستلام**: resets back to the waiting step. **تعليق**: hold toast.
- **Language toggle** in the status bar (العربية / EN) switches every string and text direction.
- Clock and date in the status bar are live.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Layout fidelity

Everything is drawn on a fixed **1600 × 1000** canvas that is scaled with a CSS transform to fit the browser window, so proportions stay identical to your WinForms screenshots on any laptop or projector. Font: **Cairo** (Google Fonts). Icons: Lucide line icons (close match to the AntdUI icon set).

## Project structure

```
src/
  App.jsx              app shell, routing, invoice state machine, canvas scaling
  data.js              products, cart seed, invoice data, all AR/EN strings
  styles.css           full design system (colours, tables, cards, phone, login)
  components/
    Shell.jsx          title bar, top nav, left rail, ribbon, status bar
    Phone.jsx          phone mockup panel (disconnected / scanning / received)
  screens/
    Login.jsx
    Pos.jsx
    Invoice.jsx        waiting + review states
  assets/              logo.png, doctor.png
```

## Things you can change in 30 seconds

- **Numbers**: `src/data.js` → `posInitialTotals`, `invoiceItems`, `invoiceHeader`.
- **Products**: `src/data.js` → `products`.
- **Strings**: `src/data.js` → `t.ar` / `t.en`.
- **Brand colour**: `src/styles.css` → `--green-600`, `--green-700`.
