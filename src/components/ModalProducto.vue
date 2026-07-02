<template>
 <div 
  class="modal fade show modal-overlay" 
  style="display:block; background:rgba(0,0,0,0.5)" 
  role="dialog" 
  aria-modal="true"
>

    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ producto.nombre }}</h5>
          <button type="button" class="btn-close" @click="$emit('cerrar')"></button>
        </div>

        <div class="modal-body text-center">
          <img
            :src="producto.imagen"
            :alt="producto.nombre"
            class="img-fluid mb-3 modal-img"
          />
          <p class="fw-bold text-danger fs-5">${{ producto.precio }}</p>
          <p>{{ producto.descripcion }}</p>
        </div>

        <div class="modal-footer d-flex justify-content-between">
          <button class="btn btn-secondary" @click="$emit('cerrar')">Cerrar</button>

          <button v-if="mostrarAgregar" class="btn btn-success" @click="agregarAlCarrito">
            <i class="bi bi-cart-plus me-2"></i> Agregar al carrito
          </button>


        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCarritoStore } from "../store/carrito.js";

const props = defineProps({
  producto: {
    type: Object,
    required: true
  },
  mostrarAgregar: {
    type: Boolean,
    default: false
  }
});

const carritoStore = useCarritoStore();

const agregarAlCarrito = () => {
  carritoStore.agregarProducto(props.producto);
};
</script>
