<template>
  <div
    class="modal fade show"
    v-if="visible"
    style="display: block; background: rgba(0, 0, 0, 0.5)"
    role="dialog"
    aria-labelledby="loginTitle"
    aria-describedby="loginDesc"
    aria-modal="true"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="loginTitle" class="modal-title">Iniciar Sesión</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('cerrar')"
            aria-label="Cerrar ventana de inicio de sesión"
          ></button>
        </div>
        <div class="modal-body" id="loginDesc">
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label">Correo electrónico</label>
              <input
                v-model="email"
                type="email"
                id="email"
                placeholder="cliente@ejemplo.com"
                class="form-control"
                aria-required="true"
                required
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input
                v-model="password"
                type="password"
                id="password"
                placeholder="mínimo 8 caracteres"
                class="form-control"
                aria-required="true"
                required
              />
            </div>

            <!-- Botón con spinner global -->
            <button
              type="submit"
              class="btn btn-success w-100"
              :disabled="uiStore.loading"
              aria-busy="uiStore.loading"
            >
              <span
                v-if="uiStore.loading"
                class="spinner-border spinner-border-sm"
                aria-hidden="true"
              ></span>
              <span v-if="uiStore.loading">Procesando…</span>
              <span v-else>Entrar</span>
            </button>
          </form>
        </div>

        <!-- Footer con alternancia -->
        <div class="modal-footer">
          <button class="btn btn-link" @click="abrirRegistro">
            ¿No tienes cuenta? Regístrate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/auth.js";
import { useUiStore } from "../store/ui.js";

const props = defineProps({
  visible: { type: Boolean, default: false }
});
const emit = defineEmits(["cerrar", "abrirRegistro"]);

const authStore = useAuthStore();
const uiStore = useUiStore();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  const ok = await authStore.login(email.value, password.value);
  if (ok) {
    emit("cerrar");
  }
};

const abrirRegistro = () => {
  emit("cerrar");        // cierra el modal de login
  emit("abrirRegistro"); // notifica al padre que debe abrir RegistroUsuarioModal
};
</script>


