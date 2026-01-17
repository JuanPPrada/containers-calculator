<template>
  <q-page class="q-pa-md">
    <div v-if="tauriAvailable === false" class="text-negative">
      DB disponible solo en modo Tauri (desktop)
    </div>
    <div v-else>
      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6">Transformadores</div>
        <q-btn color="primary" label="Crear" to="/transformers/create" />
      </div>

      <q-table row-key="id" :rows="rows" :columns="columns" :loading="store.loading" flat bordered>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              color="primary"
              label="Editar"
              :to="`/transformers/${props.row.id}/edit`"
            />
            <q-btn flat dense color="negative" label="Eliminar" @click="confirmRemove(props.row)" />
          </q-td>
        </template>
      </q-table>

      <div v-if="store.error" class="text-negative q-mt-md">
        {{ store.error }}
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';
import type { Transformer } from 'src/interfaces/entities';
import { useTransformersStore } from 'src/stores/transformers';
import { isTauri } from 'src/utils/isTauri';

const $q = useQuasar();
const store = useTransformersStore();
const tauriAvailable = ref<boolean | null>(null);

const columns: QTableColumn<Transformer>[] = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
  {
    name: 'length',
    label: 'Largo',
    field: 'length',
    align: 'right',
    sortable: true,
  },
  { name: 'width', label: 'Ancho', field: 'width', align: 'right', sortable: true },
  { name: 'height', label: 'Alto', field: 'height', align: 'right', sortable: true },
  { name: 'weight', label: 'Peso', field: 'weight', align: 'right' },
  { name: 'actions', label: 'Acciones', field: () => '', align: 'right' },
];

const rows = computed(() => store.items);

function notifyError(err: unknown) {
  const message = err instanceof Error ? err.message : 'Error inesperado';
  $q.notify({ type: 'negative', message });
}

function confirmRemove(row: Transformer) {
  $q.dialog({
    title: 'Confirmar',
    message: `Eliminar "${row.name}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    void (async () => {
      try {
        await store.remove(row.id);
        $q.notify({ type: 'positive', message: 'Transformador eliminado' });
      } catch (err) {
        notifyError(err);
      }
    })();
  });
}

onMounted(async () => {
  tauriAvailable.value = await isTauri();
  if (!tauriAvailable.value) {
    return;
  }
  try {
    await store.fetchAll();
  } catch (err) {
    notifyError(err);
  }
});
</script>
