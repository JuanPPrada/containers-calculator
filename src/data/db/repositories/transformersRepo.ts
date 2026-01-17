import { getDb } from 'src/data/db/client';
import type { Transformer, TransformerPayload } from 'src/interfaces/entities';
import { ensureTauri } from 'src/utils/isTauri';

type TransformerRow = Transformer;

function validatePayload(payload: TransformerPayload) {
  if (!payload.name || !payload.name.trim()) {
    throw new Error('El nombre del transformador es requerido');
  }
  if (payload.length <= 0 || payload.width <= 0 || payload.height <= 0) {
    throw new Error('Las dimensiones deben ser mayores a 0');
  }
}

export async function list(): Promise<Transformer[]> {
  await ensureTauri();
  const db = await getDb();
  const rows = await db.select<TransformerRow[]>(
    'SELECT * FROM transformers ORDER BY created_at DESC',
  );
  return rows;
}

export async function getById(id: number): Promise<Transformer | null> {
  await ensureTauri();
  const db = await getDb();
  const rows = await db.select<TransformerRow[]>(
    'SELECT * FROM transformers WHERE id = ?',
    [id],
  );
  return rows[0] ?? null;
}

export async function create(payload: TransformerPayload): Promise<number> {
  await ensureTauri();
  validatePayload(payload);
  const db = await getDb();
  const result = await db.execute(
    'INSERT INTO transformers (name, length, width, height, weight, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [
      payload.name.trim(),
      payload.length,
      payload.width,
      payload.height,
      payload.weight ?? null,
      payload.notes ?? null,
    ],
  );
  if (typeof result.lastInsertId !== 'number') {
    throw new Error('No se pudo crear el transformador');
  }
  return result.lastInsertId;
}

export async function update(id: number, payload: TransformerPayload): Promise<void> {
  await ensureTauri();
  validatePayload(payload);
  const db = await getDb();
  await db.execute(
    'UPDATE transformers SET name = ?, length = ?, width = ?, height = ?, weight = ?, notes = ?, updated_at = datetime(\'now\') WHERE id = ?',
    [
      payload.name.trim(),
      payload.length,
      payload.width,
      payload.height,
      payload.weight ?? null,
      payload.notes ?? null,
      id,
    ],
  );
}

export async function remove(id: number): Promise<void> {
  await ensureTauri();
  const db = await getDb();
  await db.execute('DELETE FROM transformers WHERE id = ?', [id]);
}
