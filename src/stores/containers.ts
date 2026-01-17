import { defineStore } from 'pinia';
import type { Container, ContainerPayload } from 'src/interfaces/entities';
import { ensureTauri } from 'src/utils/isTauri';
import * as containersRepo from 'src/data/db/repositories/containersRepo';

function normalizeError(err: unknown): Error {
  if (err instanceof Error) {
    return err;
  }
  return new Error('Error inesperado');
}

export const useContainersStore = defineStore('containers', {
  state: () => ({
    items: [] as Container[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        this.items = await containersRepo.list();
      } catch (err) {
        const error = normalizeError(err);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchOne(id: number): Promise<Container | null> {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        const item = await containersRepo.getById(id);
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
    async create(payload: ContainerPayload): Promise<number> {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        const id = await containersRepo.create(payload);
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
    async update(id: number, payload: ContainerPayload): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        await containersRepo.update(id, payload);
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
        await containersRepo.remove(id);
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
