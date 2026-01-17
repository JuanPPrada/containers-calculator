<template>
  <q-page class="q-pa-md">
    <div v-if="tauriAvailable === false" class="text-negative">
      DB disponible solo en modo Tauri (desktop)
    </div>
    <div v-else>
      <div class="text-h6 q-mb-md">{{ title }}</div>

      <q-form class="q-gutter-md" @submit.prevent="onSubmit">
        <q-input v-model.trim="form.name" label="Nombre" :disable="store.loading" required />
        <q-input
          v-model.number="form.length"
          type="number"
          label="Largo"
          min="0"
          step="any"
          :disable="store.loading"
          required
        />
        <q-input
          v-model.number="form.width"
          type="number"
          label="Ancho"
          min="0"
          step="any"
          :disable="store.loading"
          required
        />
        <q-input
          v-model.number="form.height"
          type="number"
          label="Alto"
          min="0"
          step="any"
          :disable="store.loading"
          required
        />
        <q-input
          v-model.number="form.max_weight"
          type="number"
          label="Peso Max"
          min="0"
          step="any"
          clearable
          :disable="store.loading"
        />

        <div class="row q-gutter-sm">
          <q-btn color="primary" label="Guardar" type="submit" :loading="store.loading" />
          <q-btn flat label="Cancelar" :disable="store.loading" @click="onCancel" />
        </div>
      </q-form>

      <div v-if="store.error" class="text-negative q-mt-md">
        {{ store.error }}
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import type { ContainerPayload } from 'src/interfaces/entities';
import { useContainersStore } from 'src/stores/containers';
import { isTauri } from 'src/utils/isTauri';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const store = useContainersStore();
const tauriAvailable = ref<boolean | null>(null);

const form = ref<ContainerPayload>({
  name: '',
  length: 0,
  width: 0,
  height: 0,
  max_weight: null,
});

const isEdit = computed(() => Boolean(route.params.id));
const title = computed(() => (isEdit.value ? 'Editar contenedor' : 'Crear contenedor'));

function notifyError(err: unknown) {
  const message = err instanceof Error ? err.message : 'Error inesperado';
  $q.notify({ type: 'negative', message });
}

function validateForm(): string | null {
  if (!form.value.name.trim()) {
    return 'El nombre es requerido';
  }
  if (form.value.length <= 0 || form.value.width <= 0 || form.value.height <= 0) {
    return 'Las dimensiones deben ser mayores a 0';
  }
  return null;
}

async function loadExisting() {
  const id = Number(route.params.id);
  if (Number.isNaN(id)) {
    notifyError(new Error('ID invalido'));
    return;
  }
  const item = await store.fetchOne(id);
  if (!item) {
    notifyError(new Error('Contenedor no encontrado'));
    return;
  }
  form.value = {
    name: item.name,
    length: item.length,
    width: item.width,
    height: item.height,
    max_weight: item.max_weight ?? null,
    notes: item.notes ?? null,
  };
}

async function onSubmit() {
  const validationError = validateForm();
  if (validationError) {
    notifyError(new Error(validationError));
    return;
  }
  try {
    if (isEdit.value) {
      const id = Number(route.params.id);
      await store.update(id, form.value);
    } else {
      await store.create(form.value);
    }
    await router.push('/containers');
  } catch (err) {
    notifyError(err);
  }
}

async function onCancel() {
  await router.push('/containers');
}

onMounted(async () => {
  tauriAvailable.value = await isTauri();
  if (!tauriAvailable.value) {
    return;
  }
  if (isEdit.value) {
    try {
      await loadExisting();
    } catch (err) {
      notifyError(err);
    }
  }
});
</script>
