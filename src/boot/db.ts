import { boot } from 'quasar/wrappers';

export default boot(async () => {
  // Log para confirmar que el boot sí corre (SIEMPRE)
  console.log('[BOOT] db.ts loaded');

  // Detectar Tauri de forma correcta (v2)
  const { isTauri } = await import('@tauri-apps/api/core');

  if (!isTauri()) {
    console.log('[BOOT] not tauri, skipping db init');
    return;
  }

  console.log('[BOOT] tauri detected, initializing db...');

  const { initDb } = await import('src/data/db/init');
  await initDb();
});
