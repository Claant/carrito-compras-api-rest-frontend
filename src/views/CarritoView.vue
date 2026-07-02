<script setup>
import { useCarritoStore } from "../store/carrito.js";
import { useOrdenStore } from "../store/ordenStore.js";
import { usePagoStore } from "../store/pagoStore.js";
import { useUiStore } from "../store/ui.js";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const carritoStore = useCarritoStore();
const ordenStore = useOrdenStore();
const pagoStore = usePagoStore();
const uiStore = useUiStore();
const metodoPago = ref("tarjeta");
const router = useRouter();

onMounted(() => {
  const usuarioId = localStorage.getItem("usuarioId");
  if (usuarioId) {
    carritoStore.obtenerCarrito(usuarioId);
  } else {
    carritoStore.productos = [];
    carritoStore.total = 0;
    carritoStore.carro = null;
  }
});

async function generarOrden() {
  try {
    const usuarioId = localStorage.getItem("usuarioId");

    // Validación: no generar orden si carrito vacío
    if (!carritoStore.carro || !carritoStore.carro._id || carritoStore.productos.length === 0) {
      alert("No puedes generar una orden sin productos ");
      return;
    }

    const carroId = carritoStore.carro._id;
    const nuevaOrden = await ordenStore.crearOrden(usuarioId, carroId);
    localStorage.setItem("ordenId", nuevaOrden._id);
    router.push("/pago");
  } catch (err) {
    console.error("Error al crear orden:", err);
    alert("Error al generar la orden ");
  }
}

async function confirmarPago() {
  try {
    const ordenId = localStorage.getItem("ordenId");
    if (!ordenId) {
      alert("No se encontró una orden pendiente ");
      return;
    }

    const pago = await pagoStore.registrarPago(ordenId, metodoPago.value);

    // Vaciar carrito en frontend
    carritoStore.productos = [];
    carritoStore.total = 0;
    carritoStore.carro = null;

    alert(`Pago registrado con éxito: ${pago.estadoPago}`);
    router.push("/mis-compras");
  } catch (err) {
    console.error("Error al confirmar pago:", err);
    alert("Error al procesar el pago");
  }
}

function calcularDescuento(prod) {
  if (prod.precioAntiguo) {
    return Math.round(((prod.precioAntiguo - prod.precio) / prod.precioAntiguo) * 100);
  }
  return 0;
}
</script>

<template>
  <div class="carrito-container mx-auto my-5 p-4 shadow-sm rounded">
    <h2 class="text-center fw-bold mb-4">🛒 Carrito de Compras</h2>

    <!-- Mensaje si está vacío -->
    <div v-if="carritoStore.productos.length === 0 && !uiStore.loading" class="text-center text-muted">
      <p>Tu carrito está vacío.</p>
    </div>

    <!-- Spinner de carga -->
    <div v-if="uiStore.loading" class="text-center my-4">
      <div class="spinner-border text-success" role="status"></div>
      <p class="mt-2">Actualizando carrito...</p>
    </div>

    <!-- Tabla de productos -->
    <table v-else class="table table-striped align-middle">
      <thead class="table-light">
        <tr>
          <th>Producto</th>
          <th class="text-center">Cantidad</th>
          <th class="text-end">Precio</th>
          <th class="text-end">Subtotal</th>
          <th class="text-center">Eliminar producto</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in carritoStore.productos" :key="item.productoId">
          <td>{{ item.nombre }}</td>
          <td class="text-center">
            <input
              type="number"
              v-model.number="item.cantidad"
              min="1"
              @change="carritoStore.actualizarCantidad(item)"
              class="form-control form-control-sm w-50 mx-auto"
            />
          </td>
          <td class="text-end">
            <span class="text-success fw-bold">${{ item.precio }}</span>
            <span v-if="item.precioAntiguo" class="text-muted ms-2" style="text-decoration: line-through;">
              ${{ item.precioAntiguo }}
            </span>
            <span v-if="item.precioAntiguo" class="badge bg-danger ms-2">
              -{{ calcularDescuento(item) }}%
            </span>
          </td>
          <td class="text-end">{{ item.cantidad * item.precio }}</td>
          <td class="text-center">
            <button class="btn btn-outline-danger btn-sm" @click="carritoStore.eliminarProducto(item.productoId)">
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Total -->
    <div class="text-end mt-3 fw-bold fs-5">
      Total: ${{ carritoStore.total }}
    </div>

    <!-- Botón de orden -->
    <div class="text-center mt-4">
      <button
        class="btn btn-primary px-4 py-2"
        @click="generarOrden"
        :disabled="carritoStore.productos.length === 0"
      >
        Generar Pedido
      </button>
    </div>

    <!-- Feedback -->
    <transition name="fade">
      <div
        v-if="carritoStore.feedback"
        :class="['alert', `alert-${carritoStore.feedback.type}`, 'mt-3 text-center']"
      >
        {{ carritoStore.feedback.text }}
      </div>
    </transition>
  </div>
</template>

