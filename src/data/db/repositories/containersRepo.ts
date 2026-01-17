import { getDb } from 'src/data/db/client';
import type { Container, ContainerPayload } from 'src/interfaces/entities';
import { ensureTauri } from 'src/utils/isTauri';

type ContainerRow = Container;

function validatePayload(payload: ContainerPayload) {
  if (!payload.name || !payload.name.trim()) {
    throw new Error('El nombre del contenedor es requerido');
  }
  if (payload.length <= 0 || payload.width <= 0 || payload.height <= 0) {
    throw new Error('Las dimensiones deben ser mayores a 0');
  }
}

export async function list(): Promise<Container[]> {
  await ensureTauri();
  const db = await getDb();
  const rows = await db.select<ContainerRow[]>(
    'SELECT * FROM containers ORDER BY created_at DESC',
  );
  return rows;
}

export async function getById(id: number): Promise<Container | null> {
  await ensureTauri();
  const db = await getDb();
  const rows = await db.select<ContainerRow[]>(
    'SELECT * FROM containers WHERE id = ?',
    [id],
  );
  return rows[0] ?? null;
}

export async function create(payload: ContainerPayload): Promise<number> {
  await ensureTauri();
  validatePayload(payload);
  const db = await getDb();
  const result = await db.execute(
    'INSERT INTO containers (name, length, width, height, max_weight, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [
      payload.name.trim(),
      payload.length,
      payload.width,
      payload.height,
      payload.max_weight ?? null,
      payload.notes ?? null,
    ],
  );
  if (typeof result.lastInsertId !== 'number') {
    throw new Error('No se pudo crear el contenedor');
  }
  return result.lastInsertId;
}

export async function update(id: number, payload: ContainerPayload): Promise<void> {
  await ensureTauri();
  validatePayload(payload);
  const db = await getDb();
  await db.execute(
    'UPDATE containers SET name = ?, length = ?, width = ?, height = ?, max_weight = ?, notes = ?, updated_at = datetime(\'now\') WHERE id = ?',
    [
      payload.name.trim(),
      payload.length,
      payload.width,
      payload.height,
      payload.max_weight ?? null,
      payload.notes ?? null,
      id,
    ],
  );
}

export async function remove(id: number): Promise<void> {
  await ensureTauri();
  const db = await getDb();
  await db.execute('DELETE FROM containers WHERE id = ?', [id]);
}
