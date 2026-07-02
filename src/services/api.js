// src/services/api.js
import axios from 'axios'

// exporta una instancia centralizada de Axios. Su propósito es unificar la configuración de las 
// llamadas HTTP (base URL, timeouts, cabeceras, interceptores) para que todos los componentes consuman 
// la API de forma consistente y sin repetir código.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000' // ajusta al host/puerto de tu backend
})

export default api
