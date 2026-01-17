import { getDb } from 'src/data/db/client';
import type { SqlBool } from 'src/interfaces/entities';
import {
  toSqlBool,
  type Order,
  type OrderCalculation,
  type OrderCalculationInsert,
  type OrderCalculationPayload,
  type OrderPayload,
} from 'src/interfaces/entities';
import { ensureTauri } from 'src/utils/isTauri';

type OrderRow = Order;
type OrderCalculationRow = Omit<OrderCalculation, 'stacking_enabled'> & {
  stacking_enabled: SqlBool;
};

function validateOrderPayload(payload: OrderPayload) {
  if (!payload.order_date || !payload.order_date.trim()) {
    throw new Error('La fecha del pedido es requerida');
  }
}

function mapOrderCalculationRow(row: OrderCalculationRow): OrderCalculation {
  return {
    ...row,
    stacking_enabled: row.stacking_enabled === 1 ? 1 : 0,
  };
}

function toOrderCalculationDb(payload: OrderCalculationPayload): OrderCalculationInsert {
  return {
    order_id: payload.order_id,
    container_id: payload.container_id ?? null,
    transformer_id: payload.transformer_id ?? null,

    container_name: payload.container_name ?? null,
    container_length: payload.container_length,
    container_width: payload.container_width,
    container_height: payload.container_height,
    container_max_weight: payload.container_max_weight ?? null,

    transformer_name: payload.transformer_name ?? null,
    transformer_length: payload.transformer_length,
    transformer_width: payload.transformer_width,
    transformer_height: payload.transformer_height,
    transformer_weight: payload.transformer_weight ?? null,

    stacking_enabled: toSqlBool(payload.stacking_enabled),
    orientation: payload.orientation ?? null,
    total_fit: payload.total_fit ?? null,
    notes: payload.notes ?? null,
  };
}

export async function list(): Promise<Order[]> {
  await ensureTauri();
  const db = await getDb();
  const rows = await db.select<OrderRow[]>('SELECT * FROM orders ORDER BY created_at DESC');
  return rows;
}

export async function getById(id: number): Promise<Order | null> {
  await ensureTauri();
  const db = await getDb();
  const rows = await db.select<OrderRow[]>('SELECT * FROM orders WHERE id = ?', [id]);
  return rows[0] ?? null;
}

export async function create(payload: OrderPayload): Promise<number> {
  await ensureTauri();
  validateOrderPayload(payload);
  const db = await getDb();
  const result = await db.execute(
    'INSERT INTO orders (order_number, order_date, notes) VALUES (?, ?, ?)',
    [payload.order_number ?? null, payload.order_date.trim(), payload.notes ?? null],
  );
  if (typeof result.lastInsertId !== 'number') {
    throw new Error('No se pudo crear el pedido');
  }
  return result.lastInsertId;
}

export async function update(id: number, payload: OrderPayload): Promise<void> {
  await ensureTauri();
  validateOrderPayload(payload);
  const db = await getDb();
  await db.execute('UPDATE orders SET order_number = ?, order_date = ?, notes = ? WHERE id = ?', [
    payload.order_number ?? null,
    payload.order_date.trim(),
    payload.notes ?? null,
    id,
  ]);
}

export async function remove(id: number): Promise<void> {
  await ensureTauri();
  const db = await getDb();
  await db.execute('DELETE FROM orders WHERE id = ?', [id]);
}

export async function listCalculationsByOrder(orderId: number): Promise<OrderCalculation[]> {
  await ensureTauri();
  const db = await getDb();
  const rows = await db.select<OrderCalculationRow[]>(
    'SELECT * FROM order_calculations WHERE order_id = ? ORDER BY created_at DESC',
    [orderId],
  );
  return rows.map(mapOrderCalculationRow);
}

export async function createCalculation(payload: OrderCalculationPayload): Promise<number> {
  await ensureTauri();
  const db = await getDb();
  const row = toOrderCalculationDb(payload);
  const result = await db.execute(
    `INSERT INTO order_calculations (
      order_id,
      container_id,
      transformer_id,
      container_name,
      container_length,
      container_width,
      container_height,
      container_max_weight,
      transformer_name,
      transformer_length,
      transformer_width,
      transformer_height,
      transformer_weight,
      stacking_enabled,
      orientation,
      total_fit,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.order_id,
      row.container_id ?? null,
      row.transformer_id ?? null,
      row.container_name ?? null,
      row.container_length,
      row.container_width,
      row.container_height,
      row.container_max_weight ?? null,
      row.transformer_name ?? null,
      row.transformer_length,
      row.transformer_width,
      row.transformer_height,
      row.transformer_weight ?? null,
      row.stacking_enabled,
      row.orientation ?? null,
      row.total_fit ?? null,
      row.notes ?? null,
    ],
  );
  if (typeof result.lastInsertId !== 'number') {
    throw new Error('No se pudo crear el calculo del pedido');
  }
  return result.lastInsertId;
}
