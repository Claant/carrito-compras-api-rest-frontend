<template>
  <div id="app">
    <!-- Navbar global -->
    <Navbar />

    <!-- Renderizado de páginas -->
    <main>
      <router-view :key="$route.fullPath"></router-view>
    </main>
     <FeedbackGlobal />   <!-- ✅ feedback centralizado -->
    <!-- Footer global -->
    <Footer />

    
  </div>
</template>

<script setup>
import Navbar from "../components/barraNavegacion.vue";
import Footer from "../components/footer.vue";
import FeedbackGlobal from "../components/FeedbackGlobal.vue";
import { ref, onMounted } from "vue";

const backendReady = ref(false);


// Verificar si el backend está listo al montar la aplicación, para evitar errores en el ingreso al login
onMounted(async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ping`);
    const data = await res.json();
    if (data.ok) {
      backendReady.value = true;
      console.log("Backend disponible");
    }
  } catch (err) {
    console.error("Backend no responde todavía", err);
  }
});



</script>

