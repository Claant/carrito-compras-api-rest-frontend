<template>
  <div v-if="uiStore.loading" class="loading-overlay">
    <div class="spinner-border text-primary"></div>
    <p>Cargando...</p>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui';
const uiStore = useUiStore();
</script>

