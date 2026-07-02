// src/store/usuariosStore.js
import { defineStore } from "pinia";
import axios from "axios";

const api = import.meta.env.VITE_API_URL; // backend en Render

export const useUsuariosStore = defineStore("usuarios", {
  state: () => ({
    loading: false,
    error: null,
  }),
  actions: {
    async register({ nombre, email, password, rol = "cliente" }) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.post(`${api}/api/usuarios`, {
          nombre,
          email,
          password,
          rol          // valor por defecto
      
        });
        this.loading = false;
        return res.data; // devuelve el usuario creado
      } catch (err) {
        this.loading = false;
        this.error = err.response?.data?.error || "Error al registrar usuario";
        return null;
      }
    },
  },
});
