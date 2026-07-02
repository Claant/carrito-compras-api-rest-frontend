import { defineStore } from "pinia";
import { useAuthStore } from "./auth.js";
import { useUiStore } from "./ui.js";
import { useFeedbackGlobalStore } from "./feedbackGlobal.js";
import { aplicarDescuentos } from "./descuentos.js";
import { carritoApi } from "../services/carritoApi.js";

// Mapa de descuentos centralizado
const descuentos = {
  "Aceite MIRAFLORES": 3750,
  "Coca cola 1.5L": 2500,
  "Arroz TUCAPEL": 2500
};

export const useCarritoStore = defineStore("carrito", {
  state: () => ({
    carro: { _id: null, items: [], total: 0 },
    productos: [],
    total: 0
  }),

  actions: {
    async agregarProducto(producto) {
      const uiStore = useUiStore();
      const feedbackStore = useFeedbackGlobalStore();
      try {
        uiStore.setLoading(true);
        const authStore = useAuthStore();
        const { data } = await carritoApi.agregarProducto(authStore.user._id, producto._id);

        // aplicar descuentos
        this.productos = aplicarDescuentos(data.carro.items || [], descuentos);
        this.total = data.carro.total || 0;

        feedbackStore.showFeedback("success", "Producto agregado al carrito");
      } catch (error) {
        feedbackStore.showFeedback("error", "Debe iniciar sesión antes de comprar");
      } finally {
        uiStore.setLoading(false);
      }
    },

    async obtenerCarrito(usuarioId) {
      const uiStore = useUiStore();
      try {
        uiStore.setLoading(true);
        const { data } = await carritoApi.obtenerCarrito(usuarioId);

        if (data.items && Array.isArray(data.items)) {
          this.carro = data;
          this.productos = aplicarDescuentos(data.items, descuentos);
          this.total = data.total || 0;
        } else if (Array.isArray(data) && data.length > 0) {
          const carro = data[0];
          this.carro = carro;
          this.productos = aplicarDescuentos(carro.items || [], descuentos);
          this.total = carro.total || 0;
        } else {
          this.carro = { _id: null, items: [], total: 0 };
          this.productos = [];
          this.total = 0;
        }
      } catch (error) {
        console.error("Error al obtener carrito:", error.response?.data || error.message);
      } finally {
        uiStore.setLoading(false);
      }
    },

    async eliminarProducto(productoId) {
      const uiStore = useUiStore();
      const feedbackStore = useFeedbackGlobalStore();
      try {
        uiStore.setLoading(true);
        const authStore = useAuthStore();
        await carritoApi.eliminarProducto(authStore.user._id, productoId);
        await this.obtenerCarrito(authStore.user._id);
        feedbackStore.showFeedback("success", "Producto eliminado");
      } catch (error) {
        feedbackStore.showFeedback("error", "No se pudo eliminar");
      } finally {
        uiStore.setLoading(false);
      }
    },

    async actualizarCantidad(item) {
      const uiStore = useUiStore();
      const feedbackStore = useFeedbackGlobalStore();
      try {
        uiStore.setLoading(true);
        const authStore = useAuthStore();
        const { data } = await carritoApi.actualizarCantidad(authStore.user._id, item.productoId, item.cantidad);

        // aplicar descuentos
        this.productos = aplicarDescuentos(data.items || [], descuentos);
        this.total = data.total || 0;

        feedbackStore.showFeedback("success", "Cantidad actualizada");
      } catch (error) {
        feedbackStore.showFeedback("error", "No se pudo actualizar");
      } finally {
        uiStore.setLoading(false);
      }
    }
  }
});
