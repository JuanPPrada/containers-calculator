import { defineStore } from 'pinia';
import type { Order, OrderPayload } from 'src/interfaces/entities';
import { ensureTauri } from 'src/utils/isTauri';
import * as ordersRepo from 'src/data/db/repositories/ordersRepo';

function normalizeError(err: unknown): Error {
  if (err instanceof Error) {
    return err;
  }
  return new Error('Error inesperado');
}

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    items: [] as Order[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        this.items = await ordersRepo.list();
      } catch (err) {
        const error = normalizeError(err);
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async fetchOne(id: number): Promise<Order | null> {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        const item = await ordersRepo.getById(id);
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
    async create(payload: OrderPayload): Promise<number> {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        const id = await ordersRepo.create(payload);
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
    async update(id: number, payload: OrderPayload): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await ensureTauri();
        await ordersRepo.update(id, payload);
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
        await ordersRepo.remove(id);
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
