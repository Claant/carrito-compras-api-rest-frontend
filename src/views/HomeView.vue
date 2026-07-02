<template>
  <div class="container my-4">
    <!-- Título -->
    <h2 class="mb-3">Productos destacados</h2>

    <!-- Spinner global mientras carga suspendido
    <div v-if="uiStore.loading" class="text-center my-5">
      <div class="spinner-border text-success" role="status" aria-label="Cargando productos"></div>
      <p class="mt-2">Cargando productos destacados...</p>
    </div>
-->
 <!-- Sección con fondo -->
<div id="carouselProductos" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
  
  <!-- Contenedor de slides -->
  <div class="carousel-inner">
    <div
      v-for="(grupo, index) in gruposDeProductos"
      :key="index"
      :class="['carousel-item', { active: index === 0 }]"
    >
      <div class="row productos-section">
        <div v-for="prod in grupo" :key="prod._id" class="col-6 col-md-3 mb-4">
          <ProductoCard :prod="prod" />
        </div>
      </div>
    </div>
  </div>

  <!-- Controles de navegación (fuera del recuadro de productos) -->
  <button 
    class="carousel-control-prev" 
    type="button" 
    data-bs-target="#carouselProductos" 
    data-bs-slide="prev"
  >
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Anterior</span>
  </button>

  <button 
    class="carousel-control-next" 
    type="button" 
    data-bs-target="#carouselProductos" 
    data-bs-slide="next"
  >
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Siguiente</span>
  </button>
</div>



<Teleport to="body">
  <div v-if="uiStore.loading" class="overlay-loading">
    <div class="spinner-border text-success" role="status"></div>
    <p class="mt-2">Validando credenciales...</p>
  </div>
</Teleport>

  </div>

</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { useAuthStore } from "../store/auth.js";
import { useUiStore } from "../store/ui.js";
import ProductoCard from "../components/ProductoCard.vue";
import { aplicarDescuentos } from "../store/descuentos.js";


const productos = ref([]);
const authStore = useAuthStore();
const uiStore = useUiStore();

// Cargar productos al montar
onMounted(async () => {
  try {
    uiStore.setLoading(true);
    const api = import.meta.env.VITE_API_URL;   // usar variable de entorno
    const { data } = await axios.get("${api}/api/productos");
    // Aplicamos descuentos a los productos destacados
    productos.value = aplicarDescuentos(data);
    console.log("Productos destacados:", productos.value);
  } catch (error) {
    console.error("Error cargando productos:", error);
  } finally {
    uiStore.setLoading(false);
  }
});

// Feedback visual
watch(
  () => authStore.feedback,
  (nuevo) => {
    if (nuevo) {
      setTimeout(() => {
        authStore.clearFeedback();
      }, 3000);
    }
  }
);

const feedbackClass = computed(() => {
  switch (authStore.feedback?.type) {
    case "success": return "alert-success";
    case "error": return "alert-danger";
    case "info": return "alert-info";
    default: return "alert-secondary";
  }
});


const gruposDeProductos = computed(() => {
  const grupos = [];
  for (let i = 0; i < productos.value.length; i += 4) {
    grupos.push(productos.value.slice(i, i + 4));
  }
  return grupos;
});
</script>

<style scoped>
.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-image: none; /* elimina el ícono SVG por defecto */
  width: auto;            /* sin círculo */
  height: auto;
}

.carousel-control-prev-icon::after {
  content: '‹';           /* flecha izquierda */
  font-size: 6rem;        /* tamaño grande */
  color: #000;            /* color oscuro para contraste */
  font-weight: bold;
}

.carousel-control-next-icon::after {
  content: '›';           /* flecha derecha */
  font-size: 6rem;        /* tamaño grande */
  color: #000;            /* color oscuro para contraste */
  font-weight: bold;
}

/* Hover opcional */
.carousel-control-prev-icon:hover::after,
.carousel-control-next-icon:hover::after {
  color: #C0392B; /* rojo institucional */
}
.carousel-control-prev,
.carousel-control-next {
  width: 5%;        /* ancho de la zona de clic */
}


.overlay-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

</style>


