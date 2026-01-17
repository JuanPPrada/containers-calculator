export async function isTauri(): Promise<boolean> {
  const { isTauri } = await import('@tauri-apps/api/core');
  return isTauri();
}

export async function ensureTauri(): Promise<void> {
  if (!(await isTauri())) {
    throw new Error('DB disponible solo en modo Tauri (desktop)');
  }
}
