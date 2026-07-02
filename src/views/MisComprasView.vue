<script setup>
import { onMounted, ref } from "vue";
import { useOrdenStore } from "../store/ordenStore.js";
import { useUiStore } from "../store/ui.js";

const ordenStore = useOrdenStore();
const uiStore = useUiStore();
const ordenes = ref([]);

onMounted(async () => {
  uiStore.setLoading(true); // activar loading global
  const usuarioId = localStorage.getItem("usuarioId");
  if (usuarioId) {
    ordenes.value = await ordenStore.getOrdenesByUsuario(usuarioId);
  }
  uiStore.setLoading(false); // desactivar cuando termina
});
</script>

<template>
  <div class="container mt-4">
    <h2 class="text-center fw-bold mb-4">🛍️ Mis Compras</h2>

    <!-- Overlay de carga -->
    <transition name="fade">
      <div v-if="uiStore.loading" class="loading-overlay">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-3 fw-semibold text-primary">Cargando historial de compras...</p>
      </div>
    </transition>

    <!-- Mensaje solo si terminó la carga y no hay órdenes -->
    <div v-if="!uiStore.loading && ordenes.length === 0" class="text-center">
      <p class="fs-5 text-muted">No tienes compras registradas aún 🛒</p>
    </div>

    <!-- Tabla solo si hay órdenes -->
    <table v-else-if="!uiStore.loading" class="table table-hover align-middle text-center shadow-sm">
      <thead class="tabla-titulos">
        <tr>
          <th>ID Orden</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Total</th>
          <th>Items</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="orden in ordenes" :key="orden._id">
          <td>{{ orden._id }}</td>
          <td>{{ new Date(orden.fechaCreacion).toLocaleString("es-CL") }}</td>
          <td>
            <span
              :class="{
                'badge bg-warning text-dark': orden.estado === 'pendiente',
                'badge bg-success': orden.estado === 'pagado',
                'badge bg-info text-dark': orden.estado === 'entregado'
              }"
            >
              {{ orden.estado }}
            </span>
          </td>
          <td>${{ orden.total.toLocaleString("es-CL") }}</td>
          <td>
            <ul class="list-unstyled mb-0">
              <li v-for="item in orden.items" :key="item.productoId">
                • {{ item.nombre }} (x{{ item.cantidad }}) - ${{ item.precio }}
              </li>
            </ul>
          </td>
          <td>
            <router-link :to="`/orden/${orden._id}`" class="btn btn-info btn-sm">
              Ver detalle
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
