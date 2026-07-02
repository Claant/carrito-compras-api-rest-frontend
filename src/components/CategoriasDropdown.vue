<template>
  <li class="nav-item dropdown" @click="toggleCategorias">
    <button class="nav-link dropdown-toggle fw-bold text-danger" type="button">
      Categorías
    </button>
    <ul class="dropdown-menu" :class="{ show: mostrarCategorias }">
      <li v-for="cat in categorias" :key="cat">
        <router-link
          :to="{ name: 'categoria', params: { nombre: cat } }"
          class="dropdown-item d-flex align-items-center gap-2"
        >
          <i :class="iconoCategoria(cat)"></i>
          {{ cat }}
        </router-link>
      </li>
    </ul>
  </li>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";


const mostrarCategorias = ref(false);

const toggleCategorias = () => {
  mostrarCategorias.value = !mostrarCategorias.value;
};

const categorias = ["Alimentos", "Lácteos", "Electrodomesticos", "Bebidas", "Limpieza"];

const iconoCategoria = (cat) => {
  switch (cat) {
    case "Alimentos": return "bi bi-basket";
    case "Lácteos": return "bi bi-cup";
    case "Electrodomesticos": return "bi bi-tv";
    case "Bebidas": return "bi bi-cup-straw";
    case "Limpieza": return "bi bi-droplet";
    default: return "bi bi-tag";
  }
};

const handleClickOutside = (event) => {
  const dropdown = document.querySelector(".nav-item.dropdown");
  if (dropdown && !dropdown.contains(event.target)) {
    mostrarCategorias.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
