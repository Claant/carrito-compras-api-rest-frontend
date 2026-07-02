<template>
  <div class="card h-100 shadow-sm">
    <img :src="prod.imagen" width="300" heigth="300" loading="lazy" class="img-fluid" :alt="prod.nombre" />
    <div class="card-body text-center">
      <h6 class="card-title">{{ prod.nombre }}</h6>

      <!-- Bloque de precios con descuento -->
      <div>
        <span class="text-success fw-bold">${{ prod.precio }}</span>
        <span v-if="prod.precioAntiguo"
              class="text-muted ms-2"
              style="text-decoration: line-through;">
          ${{ prod.precioAntiguo }}
        </span>
        <span v-if="prod.precioAntiguo"
              class="badge bg-danger ms-2">
          -{{ calcularDescuento(prod) }}%
        </span>
      </div>

      <div class="d-flex justify-content-center gap-2 mt-2">
        <button class="btn btn-primary btn-sm" @click="abrirModal">
          Ver detalles
        </button>

        <button
          v-if="esVistaCategoria"
          class="btn btn-success btn-sm"
          @click="agregarAlCarrito"
        >
          <i class="bi bi-cart-plus me-1"></i> Agregar al carrito
        </button>

        <button
          v-else
          class="btn btn-secondary btn-sm"
          @click="$router.push(`/categoria/${prod.categoria}`)"
        >
          Ir a categoría
        </button>
      </div>
    </div>

    <Teleport to="body">
      <ModalProducto
        v-if="mostrarModal"
        :producto="productoSeleccionado"
        @cerrar="mostrarModal = false"
        :mostrarAgregar="!esVistaCategoria"
      />
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useCarritoStore } from "../store/carrito.js";
import ModalProducto from "./ModalProducto.vue";

const props = defineProps({
  prod: {
    type: Object,
    required: true
  }
});

const route = useRoute();
const carritoStore = useCarritoStore();
const productoSeleccionado = ref(null);
const mostrarModal = ref(false);

const esVistaCategoria = computed(() => route.path.includes("/categoria/"));

const abrirModal = () => {
  productoSeleccionado.value = props.prod;
  mostrarModal.value = true;
};

const agregarAlCarrito = () => {
  carritoStore.agregarProducto(props.prod);
};

// Función para calcular el porcentaje de descuento
function calcularDescuento(prod) {
  if (prod.precioAntiguo) {
    return Math.round(((prod.precioAntiguo - prod.precio) / prod.precioAntiguo) * 100);
  }
  return 0;
}
</script>
