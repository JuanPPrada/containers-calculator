import { getDb } from './client';
import schema from './schema.sql?raw';

export async function initDb() {
  console.log('[DB] initDB() called');

  const db = await getDb();
  console.log('[DB] connected');

  await db.execute(schema);

  console.log('[DB] schema ready');
}
