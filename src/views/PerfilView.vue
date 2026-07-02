<template>
  <div class="container mt-5 perfil-container">
    <h2 class="text-center fw-bold mb-4">👤 Perfil de Usuario</h2>

    <!-- Spinner global mientras carga -->
    <div v-if="uiStore.loading" class="text-center my-5">
      <div class="spinner-border text-success" role="status" aria-label="Cargando perfil"></div>
      <p class="mt-2">Cargando datos del usuario...</p>
    </div>

    <!-- Datos del usuario -->
    <div v-else class="card shadow-sm p-4 mx-auto perfil-card">
      <h5 class="fw-semibold mb-3">Bienvenido, {{ user?.nombre }}</h5>
      <p class="text-muted mb-4">{{ user?.email }}</p>

      <div class="d-flex justify-content-center">
        <button
          class="btn btn-primary btn-lg boton-compras"
          @click="irAMisCompras"
        >
          🛍️ Ver historial de compras
        </button>
      </div>
    </div>

    <!-- Overlay de carga -->
    <transition name="fade">
      <div v-if="uiStore.loading" class="loading-overlay">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-3 fw-semibold text-primary">Cargando historial de compras...</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useAuthStore } from '../store/auth.js'
import { useUiStore } from '../store/ui.js'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const uiStore = useUiStore()
const user = authStore.user
const router = useRouter()

function irAMisCompras() {
  uiStore.setLoading(true)
  // Simulamos la carga como en CarritoView
  setTimeout(() => {
    uiStore.setLoading(false)
    router.push('/mis-compras')
  }, 1500)
}
</script>

