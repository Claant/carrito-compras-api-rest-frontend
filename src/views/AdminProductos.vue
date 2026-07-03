<template>
  <div class="admin-products container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Gestión de Productos</h2>
      <div>
        <button class="btn btn-primary me-2" @click="openCreate">Agregar nuevo producto</button>
        <button class="btn btn-outline-secondary" @click="fetchProducts">Refrescar la pagina</button>
      </div>
    </div>

   <div v-if="uiStore.loading" class="mb-3">Cargando productos...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

<div v-if="!uiStore.loading && products.length === 0" class="text-muted">No hay productos aún.</div>

    <div v-if="products.length" class="table-responsive">
      <table class="table table-hover align-middle">
        <thead class="table-light">
          <tr>
            <th style="width:90px">Imagen</th>
            <th>Nombre</th>
            <th style="width:120px">Precio</th>
            <th style="width:100px">Stock</th>
            <th>Categoría</th>
            <th style="width:170px">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in products" :key="p._id || p.id">
            <td>
              <img v-if="p.imagen" :src="p.imagen" alt="" class="img-thumbnail" style="max-width:72px; max-height:56px; object-fit:cover;">
              <div v-else class="text-muted small">Sin imagen</div>
            </td>
            <td>{{ p.nombre }}</td>
            <td>{{ formatCurrency(p.precio) }}</td>
            <td>{{ p.stock }}</td>
            <td>{{ p.categoria || '-' }}</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary me-2" @click="openEdit(p)">Editar</button>
              <button class="btn btn-sm btn-outline-danger" @click="remove(p)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal (create / edit) -->
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-content p-3">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="mb-0">{{ editing ? 'Editar producto' : 'Nuevo producto' }}</h5>
            <button class="btn-close" @click="closeModal" aria-label="Cerrar"></button>
          </div>

          <form @submit.prevent="save">
            <div class="row">
              <div class="col-md-8">
                <div class="mb-2">
                  <label class="form-label">Nombre</label>
                  <input v-model="form.nombre" class="form-control" required />
                </div>

                <div class="row">
                  <div class="col-6 mb-2">
                    <label class="form-label">Precio</label>
                    <input v-model.number="form.precio" type="number" step="0.01" min="0" class="form-control" required />
                  </div>
                  <div class="col-6 mb-2">
                    <label class="form-label">Stock</label>
                    <input v-model.number="form.stock" type="number" min="0" class="form-control" required />
                  </div>
                </div>

                <div class="mb-2">
                  <label class="form-label">Categoría</label>
                  <input v-model="form.categoria" class="form-control" />
                </div>

                <div class="mb-2">
                  <label class="form-label">Descripción</label>
                  <textarea v-model="form.descripcion" class="form-control" rows="3"></textarea>
                </div>

                <div class="mb-2">
                  <label class="form-label">URL imagen (opcional)</label>
                  <input v-model="form.imagen" class="form-control" placeholder="https://..." />
                </div>
              </div>

              <div class="col-md-4">
                <label class="form-label">Imagen (subir)</label>
                <input ref="fileRef" type="file" accept="image/*" class="form-control mb-2" @change="onFile" />
                <div v-if="preview" class="border p-2 text-center">
                  <img :src="preview" alt="preview" style="max-width:100%; max-height:160px; object-fit:contain;">
                </div>
                <div v-else-if="form.imagen" class="border p-2 text-center">
                  <img :src="form.imagen" alt="preview-url" style="max-width:100%; max-height:160px; object-fit:contain;">
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end gap-2 mt-3">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <span v-if="saving">Guardando...</span>
                <span v-else>{{ editing ? 'Guardar' : 'Crear' }}</span>
              </button>
            </div>
          </form>

          <div v-if="formError" class="alert alert-danger mt-2">{{ formError }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js' // instancia axios centralizada
import { useUiStore } from '../store/ui'


const uiStore = useUiStore();

const products = ref([])
const error = ref(null)

const showModal = ref(false)
const editing = ref(false)
const saving = ref(false)
const formError = ref(null)
const preview = ref(null)
const fileRef = ref(null)

const form = ref({
  id: null,
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0,
  categoria: '',
  imagen: '',
  imageFile: null
})

// Reemplaza formatCurrency por esta versión
function formatCurrency(v) {
  const n = Number(v);
  if (!isFinite(n)) return '-';
  try { return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(n) } catch { return n }
}

// Reemplaza fetchProducts() por esta
async function fetchProducts() {
  uiStore.setLoading(true);
  error.value = null;
  try {
    const res = await api.get('/api/productos');
    console.log('GET /api/productos response:', res);

    const origin = window.location.origin;
    products.value = (res.data || []).map(p => {
      const nombre = p.nombre ?? p.name ?? '';
      const descripcion = p.descripcion ?? p.description ?? '';
      const precioRaw = p.precio ?? p.price ?? 0;
      const stockRaw = p.stock ?? p.cantidad ?? 0;
      const categoria = p.categoria ?? p.category ?? '';
      let imagen = p.imagen ?? p.image ?? p.imageUrl ?? '';

      const precio = Number(precioRaw) || 0;
      const stock = Number(stockRaw) || 0;

      if (typeof imagen === 'string' && imagen.startsWith('/')) {
        imagen = origin.replace(/\/$/, '') + imagen;
      }

      return {
        ...p,
        nombre,
        descripcion,
        precio,
        stock,
        categoria,
        imagen
      };
    });

    console.log('Normalized products:', products.value);
  } catch (err) {
    console.error('Error fetching productos:', err);
    error.value = 'No se pudieron cargar los productos.';
  } finally {
     uiStore.setLoading(false);
  }
}

function openCreate() {
  editing.value = false; formError.value = null; preview.value = null
  form.value = { id: null, nombre: '', descripcion: '', precio: 0, stock: 0, categoria: '', imagen: '', imageFile: null }
  showModal.value = true
}

function openEdit(p) {
  editing.value = true; formError.value = null; preview.value = null
  form.value = {
    id: p._id || p.id,
    nombre: p.nombre || '',
    descripcion: p.descripcion || '',
    precio: p.precio || 0,
    stock: p.stock || 0,
    categoria: p.categoria || '',
    imagen: p.imagen || '',
    imageFile: null
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false; formError.value = null; preview.value = null
  if (fileRef.value) fileRef.value.value = null
}

function onFile(e) {
  const f = e.target.files[0]; if (!f) return
  form.value.imageFile = f
  const reader = new FileReader()
  reader.onload = () => { preview.value = reader.result }
  reader.readAsDataURL(f)
}
async function save() {
  formError.value = null
  saving.value = true
  uiStore.setLoading(true)

  try {
    if (!form.value.nombre) {
      formError.value = 'Nombre requerido'
      return
    }

    if (form.value.imageFile) {
      const fd = new FormData()
      fd.append('image', form.value.imageFile)
      fd.append('nombre', form.value.nombre)
      fd.append('descripcion', form.value.descripcion || '')
      fd.append('precio', parseFloat(form.value.precio))
      fd.append('stock', parseInt(form.value.stock))
      fd.append('categoria', form.value.categoria || '')

      if (editing.value) {
        await api.put(`/api/productos/${form.value.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      } else {
        await api.post('/api/productos', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      }
    } else {
      const payload = {
        nombre: form.value.nombre,
        descripcion: form.value.descripcion || '',
        precio: parseFloat(form.value.precio),
        stock: parseInt(form.value.stock),
        categoria: form.value.categoria || '',
        imagen: form.value.imagen || ''
      }

      if (editing.value) {
        await api.put(`/api/productos/${form.value.id}`, payload)
      } else {
        await api.post('/api/productos', payload)
      }
    }

    await fetchProducts()
    closeModal()
  } catch (err) {
    console.error(err)
    formError.value = err?.response?.data?.error || 'Error al guardar el producto.'
  } finally {
    saving.value = false
    uiStore.setLoading(false)   // cerrar overlay correctamente
  }
}

async function remove(p) {
  if (!confirm(`¿Borrar producto "${p.nombre}"?`)) return
  uiStore.setLoading(true)

  try {
    await api.delete(`/api/productos/${p._id || p.id}`)
    await fetchProducts()
  } catch (err) {
    console.error(err)
    error.value = err?.response?.data?.error || 'Error al borrar el producto.'
  } finally {
    uiStore.setLoading(false)
  }
}


onMounted(fetchProducts)
</script>

<style scoped>
.modal-backdrop { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.35); z-index: 3000; }
.modal-dialog { width: 820px; max-width: 95%; }
.img-thumbnail { border-radius:6px; }

/* Fondo oscuro semitransparente detrás del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* más opaco */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* Caja del modal */
.modal-content {
  background-color: #ebf3d2; /* fondo blanco sólido */
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: 800px;
  max-width: 90%;
  z-index: 1001;
}

</style>
