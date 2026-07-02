<template>
  <div>
    <!-- Navbar -->
    <nav
      class="navbar navbar-expand-lg navbar-light bg-light shadow-sm"
      role="navigation"
      aria-label="Barra de navegación principal"
    >
      <div class="container-fluid">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand">
          <img
            src="/images/logo.webp"
            alt="Logo Millennial's Store"
            width="135"
            height="81"
            class="logo-img"
          />
        </router-link>

        <!-- Categorías -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <CategoriasDropdown />
        </ul>
        <!--Boton Home-->
        <router-link to="/" class="home-boton-only">
      Home
    </router-link>

        <!-- Buscador -->
        <BuscadorProductos />

        <!-- Login / Logout / Carrito -->
        <div class="d-flex align-items-center gap-3">
          <!-- Botón login -->
          <button
            v-if="!authStore.user"
            type="button"
            class="btn btn-outline-success"
            @click="mostrarLogin = true"
            aria-label="Abrir modal de inicio de sesión"
          >
            <i class="bi bi-person"></i> Iniciar sesión
          </button>

          <!-- Dropdown usuario controlado por Vue -->
          <div v-else class="dropdown" @click="toggleDropdownUsuario">
            <button
              class="btn btn-outline-success dropdown-toggle fw-bold"
              type="button"
            >
              Hola, {{ primerNombre }}
            </button>
            <ul class="dropdown-menu" :class="{ show: mostrarDropdownUsuario }">
              <li>
                <router-link class="dropdown-item" to="/perfil">
                  <i class="bi bi-person-circle me-2"></i> Mi perfil
                </router-link>
              </li>

              <!-- Botón Administrador solo si el rol es admin -->
              <li v-if="authStore.user?.rol === 'admin'">
                <router-link
                  class="dropdown-item text-warning fw-bold"
                  to="/admin"
                >
                  <i class="bi bi-gear-fill me-2"></i> Administrador
                </router-link>
              </li>

              <li>
                <button class="dropdown-item text-danger" @click="cerrarSesion">
                  <i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión
                </button>
              </li>
            </ul>
          </div>

          <!-- Botón carrito -->
          <button
            type="button"
            class="btn btn-outline-success d-flex align-items-center"
            @click="irAlCarrito"
            aria-label="Ir al carrito de compras"
            :disabled="uiStore.loading"
          >
            <i class="bi bi-cart me-2"></i>
            <span
              v-if="uiStore.loading"
              class="spinner-border spinner-border-sm"
            ></span>
            <span v-else>Mis compras</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Feedback global -->
    <FeedbackGlobal />

    <!-- Modales -->
    <LoginModal
      :visible="mostrarLogin"
      @cerrar="mostrarLogin = false"
      @abrirRegistro="
        mostrarRegistro = true;
        mostrarLogin = false;
      "
    />
    <RegistroUsuarioModal
      :visible="mostrarRegistro"
      @cerrar="mostrarRegistro = false"
      @abrirLogin="
        mostrarLogin = true;
        mostrarRegistro = false;
      "
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../store/auth.js";
import { useUiStore } from "../store/ui.js";
import { useRouter } from "vue-router";
import CategoriasDropdown from "./CategoriasDropdown.vue";
import BuscadorProductos from "./BuscadorProductos.vue";
import FeedbackGlobal from "./FeedbackGlobal.vue";
import LoginModal from "./LoginModal.vue";
import RegistroUsuarioModal from "./RegistroUsuarioModal.vue";

const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();

const mostrarLogin = ref(false);
const mostrarRegistro = ref(false);
const mostrarDropdownUsuario = ref(false);

const toggleDropdownUsuario = () => {
  mostrarDropdownUsuario.value = !mostrarDropdownUsuario.value;
};

const cerrarSesion = () => {
  authStore.logout();
  router.push("/");
};

const irAlCarrito = () => {
  if (!authStore.user) {
    mostrarLogin.value = true;
  } else {
    router.push({ name: "carrito" });
  }
};

const primerNombre = computed(() => {
  if (!authStore.user || !authStore.user.nombre) return "";
  return authStore.user.nombre.split(" ")[0];
});
</script>

<style scoped>

/* Estilos exclusivos para Home (no comparten con otros botones) */
.home-boton-only {
  background-color: #fff;
  color: #198754;
  border: 1px solid #198754;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.18s ease, background-color 0.18s ease, color 0.18s ease;
  margin-left: 10px; /* separación extra respecto a Categorías */
  box-shadow: none;
}

/* Hover exclusivo para Home */
.home-boton-only:hover {
  background-color: #198754;
  color: #fff;
  transform: translateY(-2px);
}
</style>