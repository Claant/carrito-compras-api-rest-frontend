<template>
  <div v-if="visible" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Registro de Usuario</h5>
          <button type="button" class="btn-close" @click="$emit('cerrar')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre</label>
              <input v-model="nombre" type="text" class="form-control" id="nombre" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Correo electrónico</label>
              <input v-model="email" type="email" class="form-control" id="email" required />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Contraseña</label>
              <input v-model="password" type="password" class="form-control" id="password" required />
            </div>

            <div class="mb-3">
              <label for="rol" class="form-label">Rol</label>
              <select v-model="rol" class="form-select" id="rol">
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" class="btn btn-success w-100" :disabled="usuariosStore.loading">
              <span v-if="usuariosStore.loading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Registrarse</span>
            </button>
          </form>

          <p class="mt-3 text-center">
            ¿Ya tienes cuenta?
            <a href="#" @click.prevent="$emit('abrirLogin')">Inicia sesión</a>
          </p>

          <!-- Mensajes de feedback -->
          <div v-if="usuariosStore.error" class="alert alert-danger mt-2">
            {{ usuariosStore.error }}
          </div>
          <div v-if="usuariosStore.success" class="alert alert-success mt-2">
            {{ usuariosStore.success }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUsuariosStore } from "../store/usuariosStore.js";
import { useAuthStore } from "../store/auth.js";

const props = defineProps({ visible: Boolean });
const emit = defineEmits(["cerrar", "abrirLogin"]);

const usuariosStore = useUsuariosStore();
const authStore = useAuthStore();

const nombre = ref("");
const email = ref("");
const password = ref("");
const rol = ref("cliente");

const handleRegister = async () => {
  console.log("Datos enviados:", { nombre: nombre.value, email: email.value, password: password.value, rol: rol.value });

  const nuevoUsuario = await usuariosStore.register({
    nombre: nombre.value,
    email: email.value,
    password: password.value,
    rol: rol.value
  });

  if (nuevoUsuario) {
    usuariosStore.error = null;
    usuariosStore.success = "Usuario creado correctamente";

    // login automático después de registro
    await authStore.login(email.value, password.value);

    setTimeout(() => {
      emit("cerrar");
      nombre.value = "";
      email.value = "";
      password.value = "";
      rol.value = "cliente";
      usuariosStore.success = null;
    }, 2000);
  }
};
</script>

<style scoped>
.modal-header {
  background-color: #f8f9fa;
  border-bottom: 2px solid #0d6efd;
}
.btn-primary {
  background-color: #0d6efd;
  border: none;
}
.btn-primary:hover {
  background-color: #0b5ed7;
}
</style>
