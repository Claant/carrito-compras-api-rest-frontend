// stores/pagoStore.js
import { defineStore } from "pinia";
import axios from "axios";
import { useCarritoStore } from "./carrito.js"; // asegúrate que el nombre del archivo sea correcto

const api = import.meta.env.VITE_API_URL; // backend en Render

export const usePagoStore = defineStore("pago", {
  state: () => ({
    pagos: [],
    pagoActual: null
  }),
  actions: {
    async registrarPago(ordenId, metodoPago) {
      try {
        const res = await axios.post(`${api}/api/pagos`, {
          ordenId,
          metodoPago,
          estadoPago: "aprobado"
        });

        const data = res.data;
        this.pagoActual = data;
        this.pagos.push(data);

        // Vaciar carrito en frontend
        const carritoStore = useCarritoStore();
        if (typeof carritoStore.vaciarCarrito === "function") {
          await carritoStore.vaciarCarrito();
        }

        // Limpiar ordenId para evitar reintentos
        localStorage.removeItem("ordenId");

        return data;
      } catch (err) {
        console.error("Error al registrar pago:", err);

        // Mensaje claro desde backend
        const serverMsg = err.response?.data;
        const message =
          typeof serverMsg === "string"
            ? serverMsg
            : serverMsg?.error || serverMsg?.mensaje || err.message || "Error al registrar pago";

        throw new Error(message);
      }
    },

    async getPagoById(pagoId) {
      try {
        const res = await axios.get(`${api}/api/pagos/${pagoId}`);
        this.pagoActual = res.data;
        return res.data;
      } catch (err) {
        console.error("Error al obtener pago:", err);
        throw err;
      }
    },

    async getPagos() {
      try {
        const res = await axios.get(`${api}/api/pagos`);
        this.pagos = res.data;
        return res.data;
      } catch (err) {
        console.error("Error al obtener pagos:", err);
        throw err;
      }
    }
  }
});
