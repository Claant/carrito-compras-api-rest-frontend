<script setup>
import { ref, onMounted, computed } from "vue";
import { usePagoStore } from "../store/pagoStore.js";
import { useOrdenStore } from "../store/ordenStore.js";
import { useCarritoStore } from "../store/carrito.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth.js";
import { useUiStore } from "../store/ui.js";

const pagoStore = usePagoStore();
const ordenStore = useOrdenStore();
const carritoStore = useCarritoStore();
const router = useRouter();
const authStore = useAuthStore();
const uiStore = useUiStore();

const metodoPago = ref("tarjeta");
const orden = ref(null);
const pago = ref(null);

const total = computed(() =>
  carritoStore.productos.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  )
);

onMounted(async () => {
  uiStore.setLoading(true);
  const ordenId = localStorage.getItem("ordenId");
  if (ordenId) {
    const data = await ordenStore.getOrdenById(ordenId);
    orden.value = data;
  }
  uiStore.setLoading(false);
});

async function confirmarPago() {
  try {
    uiStore.setLoading(true);
    const ordenId = localStorage.getItem("ordenId");
    if (!ordenId) {
      pago.value = { estadoPago: "error", monto: 0 };
      uiStore.setLoading(false);
      return;
    }

    const pagoResult = await pagoStore.registrarPago(ordenId, metodoPago.value);
    pago.value = pagoResult;

    await ordenStore.getOrdenesByUsuario(authStore.user._id);

    carritoStore.productos = [];
    carritoStore.total = 0;
    carritoStore.carro = null;
    localStorage.removeItem("ordenId");

    uiStore.setLoading(false);
    setTimeout(() => router.push("/mis-compras"), 1500);
  } catch (err) {
    console.error("Error al confirmar pago:", err);
    pago.value = { estadoPago: "error", monto: 0 };
    uiStore.setLoading(false);
  }
}
</script>

<template>
  <div class="container my-5 position-relative">
    <h2 class="mb-4 text-center fw-bold">💳 Pagar ahora</h2>

    <div v-if="orden" class="card resumen-compra shadow-sm p-4 mb-4 mx-auto">
      <h5 class="fw-semibold">Resumen de tu Compra</h5>
      <table class="table table-sm">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in carritoStore.productos" :key="item._id">
            <td>{{ item.nombre }}</td>
            <td>{{ item.cantidad }}</td>
            <td>${{ item.precio * item.cantidad }}</td>
          </tr>
        </tbody>
      </table>

      <p><strong>Total Estimado:</strong> $ {{ total }}</p>

      <label for="metodoPago" class="fw-bold mt-3">Método de pago:</label>
      <select v-model="metodoPago" id="metodoPago" class="form-select w-auto mb-3">
        <option value="tarjeta">Tarjeta</option>
        <option value="transferencia">Transferencia</option>
        <option value="webpay">Webpay</option>
      </select>

      <button
        class="btn btn-success px-4 py-2 w-auto d-block mx-auto"
        @click="confirmarPago"
      >
        Confirmar Pago
      </button>
    </div>
<transition name="fade">
  <div
    v-if="pago"
    class="estado-pago-container d-flex justify-content-center align-items-center"
  >
    <div
      class="alert text-center shadow-sm"
      :class="pago.estadoPago === 'aprobado' ? 'alert-success' : 'alert-danger'"
    >
      <h5 class="fw-bold mb-2">
        {{ pago.estadoPago === 'aprobado' ? '✅ Pago aprobado' : '❌ Pago rechazado' }}
      </h5>
    
      <p class="mb-0">Gracias por tu compra</p>
    </div>
  </div>
</transition>


    <div v-if="uiStore.loading" class="loading-overlay">
      <div class="spinner-border text-success" role="status"></div>
      <p class="mt-3 fw-semibold text-primary">Procesando tu pago...</p>
    </div>
  </div>
</template>

