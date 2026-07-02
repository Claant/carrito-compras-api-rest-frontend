<template>
  <div class="admin-container d-flex">
    <!-- Menú lateral -->
   <aside class="sidebar bg-dark text-white p-3">
  <h4 class="fw-bold mb-4" style="font-size:1.6rem !important; font-weight:500 !important; color:#0b7f6b !important; margin-bottom:0.9rem !important;">
    ⚙️ Panel Admin
  </h4>

  <ul class="nav flex-column">
    <li class="nav-item">
      <router-link
        to="/admin/productos"
        class="nav-link text-white"
        style="font-size:1.28rem !important; font-weight:600 !important; color:inherit !important; padding:10px 8px !important; display:inline-block !important;"
      >
        Productos
      </router-link>
    </li>

    <li class="nav-item">
      <router-link
        to="/admin/usuarios"
        class="nav-link text-white"
        style="font-size:1.28rem !important; font-weight:600 !important; color:inherit !important; padding:10px 8px !important; display:inline-block !important;"
      >
        Usuarios
      </router-link>
    </li>

    <!-- Dropdown único de Reportes -->
    <li class="nav-item dropdown">
      <a
        class="nav-link dropdown-toggle text-white"
        href="#"
        id="menuReportes"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style="font-size:1.28rem !important; font-weight:600 !important; color:inherit !important; padding:10px 8px !important; display:inline-block !important;"
      >
        Reportes
      </a>
      <ul class="dropdown-menu" aria-labelledby="menuReportes">
        <li>
          <router-link :to="{ name: 'admin-reportes', params: { tipo: 'diaria' } }" class="dropdown-item" style="font-size:1.08rem !important; font-weight:600 !important;">
            Venta diaria
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'admin-reportes', params: { tipo: 'semanal' } }" class="dropdown-item" style="font-size:1.08rem !important; font-weight:600 !important;">
            Venta semanal
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'admin-reportes', params: { tipo: 'mensual' } }" class="dropdown-item" style="font-size:1.08rem !important; font-weight:600 !important;">
            Venta mensual
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'admin-reportes', params: { tipo: 'anual' } }" class="dropdown-item" style="font-size:1.08rem !important; font-weight:600 !important;">
            Venta anual
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'admin-reportes', params: { tipo: 'producto' } }" class="dropdown-item" style="font-size:1.08rem !important; font-weight:600 !important;">
            Venta por producto
          </router-link>
        </li>
      </ul>
    </li>
  </ul>
</aside>


    <!-- Contenido dinámico -->
    <main class="flex-grow-1 p-4">
      <router-view />
    </main>
  </div>
</template>


<script setup>
import { onMounted } from "vue";
import * as bootstrap from "bootstrap";

onMounted(() => {
  const el = document.getElementById("menuReportes");
  if (el) {
    const dropdown = new bootstrap.Dropdown(el);
    // fuerza el toggle al clic
    el.addEventListener("click", (e) => {
      e.preventDefault();
      dropdown.toggle();
    });
  } else {
    console.error("No se encontró el elemento #menuReportes");
  }
});
</script>
