<template>
  <div class="container mt-4">
    <h2>Lista de Usuarios</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Fecha Registro</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario._id">
          <td>{{ usuario.nombre }}</td>
          <td>{{ usuario.email }}</td>
          <td>{{ usuario.rol }}</td>
          <td>{{ new Date(usuario.fechaRegistro).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const usuarios = ref([])

onMounted(async () => {
  try {
    const api = import.meta.env.VITE_API_URL;   // usar variable de entorno
    const { data } = await axios.get(`${api}/api/usuarios`);
    usuarios.value = data;
  } catch (error) {
    console.error("Error cargando usuarios:", error);
  }
});

</script>
