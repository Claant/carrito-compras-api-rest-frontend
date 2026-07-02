<template>
  <form class="d-flex flex-grow-1 mx-lg-3" role="search" aria-label="Buscador de productos" @submit.prevent="buscar">
    <input
      v-model="query"
      class="form-control me-2 flex-grow-1"
      type="search"
      placeholder="¿Qué quieres comprar?"
      aria-label="Buscar productos"
    />
    <button class="btn btn-outline-danger" type="submit" aria-label="Buscar">
      <i class="bi bi-search"></i>
    </button>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const query = ref("");
const router = useRouter();

const buscar = () => {
  if (query.value.trim()) {
    router.push({ name: "buscar", params: { nombre: query.value } });
  }
};

</script>
