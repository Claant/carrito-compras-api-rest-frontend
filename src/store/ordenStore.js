// stores/ordenStore.js
import { defineStore } from "pinia";
import axios from "axios";

const api = import.meta.env.VITE_API_URL; // backend en Render

export const useOrdenStore = defineStore("orden", {
  state: () => ({
    ordenes: [],
    ordenActual: null
  }),
  actions: {
    async crearOrden(usuarioId, carroId) {
      const res = await axios.post(`${api}/api/ordenesPedido`, {
        usuarioId,
        carroId
      });
      const nuevaOrden = res.data;
      localStorage.setItem("ordenId", nuevaOrden._id);
      this.ordenActual = nuevaOrden;
      this.ordenes.push(nuevaOrden);
      return nuevaOrden;
    },

    async getOrdenById(ordenId) {
      const res = await axios.get(`${api}/api/ordenesPedido/${ordenId}`);
      this.ordenActual = res.data;
      return res.data;
    },

    async getOrdenesByUsuario(usuarioId) {
      const res = await axios.get(`${api}/api/ordenesPedido/usuarios/${usuarioId}`);
      this.ordenes = res.data.ordenes;
      return res.data.ordenes;
    }
  }
});
