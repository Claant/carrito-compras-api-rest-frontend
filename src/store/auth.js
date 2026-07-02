// src/store/auth.js
import { defineStore } from "pinia";
import { useUiStore } from "./ui.js";
import { useFeedbackGlobalStore } from "./feedbackGlobal.js"; // importa el store global

const api = import.meta.env.VITE_API_URL; // backend en Render

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null
    // ya no necesitas feedback aquí
  }),
  actions: {
   async login(email, password) {
  const uiStore = useUiStore();
  const feedbackStore = useFeedbackGlobalStore();
  try {
    uiStore.setLoading(true);

    let res;
    try {
      // Primer intento
      res = await fetch(`${api}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    } catch (err) {
      // Si falla, reintenta después de 1 segundo
      await new Promise(r => setTimeout(r, 1000));
      res = await fetch(`${api}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
    }

    const data = await res.json();

    if (res.ok && data.user) {
      this.user = data.user;
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("usuarioId", data.user._id);

      feedbackStore.showFeedback("success", data.message);
      return true;
    } else {
      feedbackStore.showFeedback("error", data.error || "Credenciales inválidas");
      return false;
    }
  } catch (err) {
    feedbackStore.showFeedback("error", `Error de conexión: ${err.message}`);
    return false;
  } finally {
    uiStore.setLoading(false);
  }
},


    logout() {
      const feedbackStore = useFeedbackGlobalStore();
      this.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("usuarioId");
      feedbackStore.showFeedback("info", "Sesión cerrada"); // usa feedback global
    }
  }
});
