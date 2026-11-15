-- ---------------------------------------------------------------------------
-- MEDICs POS - reference schema (PostgreSQL)
--
-- STATUS: NOT USED BY THE PROTOTYPE.
-- The prototype is frontend-only; every value on screen comes from mock data
-- in src/data.js. This file documents the data model those screens imply, so
-- the real .NET/PostgreSQL backend can be built against the same shape.
-- Running it does not change the app in any way.
-- ---------------------------------------------------------------------------

CREATE TABLE branches (
  id            BIGSERIAL PRIMARY KEY,
  code          TEXT NOT NULL UNIQUE,
  name_ar       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  is_main       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id             BIGSERIAL PRIMARY KEY,
  username       TEXT NOT NULL UNIQUE,
  full_name      TEXT NOT NULL,
  role           TEXT NOT NULL,               -- admin | cashier | pharmacist
  password_hash  TEXT NOT NULL,               -- never stored in this repo
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE suppliers (
  id         BIGSERIAL PRIMARY KEY,
  code       TEXT UNIQUE,
  name_ar    TEXT NOT NULL,
  name_en    TEXT,
  phone      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE products (
  id            BIGSERIAL PRIMARY KEY,
  barcode       TEXT UNIQUE,
  name_ar       TEXT NOT NULL,
  name_en       TEXT,
  unit          TEXT NOT NULL,                -- Box | Tube | Piece | Amp
  unit_price    NUMERIC(12,2) NOT NULL DEFAULT 0,
  expiry_date   DATE,
  stock_qty     INTEGER NOT NULL DEFAULT 0,   -- per branch in a real build
  branch_id     BIGINT REFERENCES branches(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE purchase_invoices (
  id             BIGSERIAL PRIMARY KEY,
  supplier_id    BIGINT REFERENCES suppliers(id),
  invoice_number TEXT NOT NULL,
  invoice_date   DATE NOT NULL,
  received_date  DATE NOT NULL,
  review_state   TEXT NOT NULL DEFAULT 'pending',  -- pending | matched | held
  scanned_by     BIGINT REFERENCES users(id),
  total_amount   NUMERIC(12,2) NOT NULL DEFAULT 0,
  branch_id      BIGINT REFERENCES branches(id),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (supplier_id, invoice_number)
);

CREATE TABLE purchase_invoice_items (
  id                BIGSERIAL PRIMARY KEY,
  invoice_id        BIGINT NOT NULL REFERENCES purchase_invoices(id) ON DELETE CASCADE,
  product_id        BIGINT REFERENCES products(id),   -- NULL when unrecognised
  raw_name          TEXT,
  barcode           TEXT,
  qty               INTEGER NOT NULL DEFAULT 0,
  unit_price        NUMERIC(12,2) NOT NULL DEFAULT 0,
  bonus_qty         INTEGER NOT NULL DEFAULT 0,
  discount_pct      NUMERIC(6,2) NOT NULL DEFAULT 0,
  current_stock     INTEGER NOT NULL DEFAULT 0,
  match_state       TEXT NOT NULL DEFAULT 'ok'        -- ok | review | unknown
);

CREATE TABLE sales (
  id             BIGSERIAL PRIMARY KEY,
  branch_id      BIGINT REFERENCES branches(id),
  cashier_id     BIGINT REFERENCES users(id),
  customer_code  TEXT,
  customer_phone TEXT,
  payment_method TEXT NOT NULL,               -- cash | card | delivery | later
  note           TEXT,
  total_discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_amount   NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sale_items (
  id             BIGSERIAL PRIMARY KEY,
  sale_id        BIGINT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id     BIGINT NOT NULL REFERENCES products(id),
  qty            INTEGER NOT NULL,
  unit_price     NUMERIC(12,2) NOT NULL,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_purchase_items_invoice ON purchase_invoice_items(invoice_id);
CREATE INDEX idx_sale_items_sale ON sale_items(sale_id);
