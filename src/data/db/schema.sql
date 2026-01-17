PRAGMA foreign_keys = ON;

-- CATALOG: Transformers
CREATE TABLE IF NOT EXISTS transformers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  length REAL NOT NULL,
  width  REAL NOT NULL,
  height REAL NOT NULL,
  weight REAL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

-- CATALOG: Containers
CREATE TABLE IF NOT EXISTS containers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  length REAL NOT NULL,
  width  REAL NOT NULL,
  height REAL NOT NULL,
  max_weight REAL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT
);

-- Orders (Pedido)
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT,
  order_date TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Each row = one "calculation" inside an order
CREATE TABLE IF NOT EXISTS order_calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,

  -- chosen catalog refs (nullable if custom)
  container_id INTEGER,
  transformer_id INTEGER,

  -- snapshot values used for calc (store ALWAYS)
  container_name TEXT,
  container_length REAL NOT NULL,
  container_width  REAL NOT NULL,
  container_height REAL NOT NULL,
  container_max_weight REAL,

  transformer_name TEXT,
  transformer_length REAL NOT NULL,
  transformer_width  REAL NOT NULL,
  transformer_height REAL NOT NULL,
  transformer_weight REAL,

  stacking_enabled INTEGER NOT NULL DEFAULT 0,
  orientation TEXT,
  total_fit INTEGER,
  notes TEXT,

  created_at TEXT NOT NULL DEFAULT (datetime('now')),

  FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY(container_id) REFERENCES containers(id) ON DELETE SET NULL,
  FOREIGN KEY(transformer_id) REFERENCES transformers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_calc_order ON order_calculations(order_id);
