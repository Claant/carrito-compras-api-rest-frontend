// src/services/carritoApi.js
import api from './api.js'

export const carritoApi = {
  agregarProducto(usuarioId, productoId, cantidad = 1) {
    return api.post('/api/carro', {
      usuarioId,
      items: [{ productoId, cantidad }]
    })
  },

  obtenerCarrito(usuarioId) {
    return api.get(`/api/carro/usuario/${usuarioId}`)
  },

  eliminarProducto(usuarioId, productoId) {
    return api.delete(`/api/carro/producto/${productoId}`, {
      data: { usuarioId }
    })
  },

  actualizarCantidad(usuarioId, productoId, cantidad) {
    return api.put(`/api/carro/producto/${productoId}/cantidad`, {
      usuarioId,
      cantidad
    })
  }
}
