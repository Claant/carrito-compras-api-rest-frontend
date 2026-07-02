<template>
  <div class="container my-4 position-relative">
    <h2>
      {{ esBusqueda ? `Resultados de búsqueda: ${termino}` : `Categoría: ${categoria}` }}
    </h2>

 <!-- Overlay de carga -->
<div v-if="uiStore.loading" class="loading-overlay">
  <div class="spinner-border text-success" role="status" aria-label="Cargando productos"></div>
  <p>
    {{ esBusqueda ? `Buscando productos de ${termino}...` : `Cargando productos de ${categoria}...` }}
  </p>
</div>


    <!-- Mensaje si no hay resultados -->
    <div v-if="!uiStore.loading && productos.length === 0" class="alert alert-warning">
      {{ esBusqueda ? "No se encontraron productos que coincidan con la busqueda" : "No hay productos en esta categoría." }}
    </div>

    <!-- Mostrar resultados -->
    <div class="row">
      <div v-for="prod in productos" :key="prod._id" class="col-6 col-md-3 mb-4">
        <ProductoCard :prod="prod" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import ProductoCard from "../components/ProductoCard.vue";
import { useUiStore } from "../store/ui.js";
import { aplicarDescuentos } from "../store/descuentos.js";

const route = useRoute();
const productos = ref([]);
const uiStore = useUiStore();
const esBusqueda = ref(false);
const termino = ref("");
const categoria = ref("");
const api = import.meta.env.VITE_API_URL;

const cargarDatos = async () => {
  try {
    uiStore.setLoading(true);

    // 🔎 Detectamos si la ruta es búsqueda o categoría
    if (route.name === "buscar") {
      esBusqueda.value = true;
      termino.value = route.params.nombre;
      // Buscar productos
const { data } = await axios.get(
  `${api}/api/productos/buscar?q=${termino.value}`
);
      productos.value = aplicarDescuentos(data);
      console.log("Resultados de búsqueda:", productos.value);
    } else if (route.name === "categoria") {
      esBusqueda.value = false;
      categoria.value = route.params.nombre;
      const { data } = await axios.get(
        `${api}/api/productos/categoria/${categoria.value}`
      );
      productos.value = aplicarDescuentos(data);
      console.log("Productos en categoría:", productos.value);
    }
  } catch (error) {
    console.error("Error cargando productos:", error);
  } finally {
    uiStore.setLoading(false);
  }
};

onMounted(cargarDatos);

watch(
  () => route.params.nombre,
  () => {
    cargarDatos();
  }
);
</script>
