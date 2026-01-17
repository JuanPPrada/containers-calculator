<script setup lang="ts">
import { useExample } from './PiniaExample';

const { count, increment } = useExample();
</script>

<template>
  <div class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Pinia Example</div>
        <div class="text-subtitle2">Count: {{ count }}</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Increment" color="primary" @click="increment" />
      </q-card-actions>
    </q-card>
  </div>
</template>
