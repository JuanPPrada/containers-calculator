import { defineStore } from 'pinia';
import type { Transformer, TransformerPayload } from 'src/interfaces/entities';
import { ensureTauri } from 'src/utils/isTauri';
import * as transformersRepo from 'src/data/db/repositories/transformersRepo';

function normalizeError(err: unknown): Error {
  if (err instanceof Error) {
    return err;
  }
  return new Error('Error inesperado');
}

export const useTransformersStore = defineStore('transformers', {
  state: () => ({
    items: [] as Transformer[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        this.items = await transformersRepo.list();
      } catch (err) {
        const error = normalizeError(err);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchOne(id: number): Promise<Transformer | null> {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        const item = await transformersRepo.getById(id);
        if (item) {
          const index = this.items.findIndex((entry) => entry.id === id);
          if (index >= 0) {
            this.items[index] = item;
          } else {
            this.items.unshift(item);
          }
        }
        return item;
      } catch (err) {
        const error = normalizeError(err);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async create(payload: TransformerPayload): Promise<number> {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        const id = await transformersRepo.create(payload);
        await this.fetchAll();
        return id;
      } catch (err) {
        const error = normalizeError(err);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async update(id: number, payload: TransformerPayload): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        await transformersRepo.update(id, payload);
        await this.fetchAll();
      } catch (err) {
        const error = normalizeError(err);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async remove(id: number): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        await transformersRepo.remove(id);
        this.items = this.items.filter((item) => item.id !== id);
      } catch (err) {
        const error = normalizeError(err);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
