# Millennial's Store 🛒

Ecommerce desarrollado con **Vue 3 + Vite**, gestionado con **Pinia** y conectado a un backend en **Express/MongoDB** desplegado en Render.  
Frontend desplegado en **Netlify**.

---

## 🚀 Stack Tecnológico
- Vue 3 + Vite
- Pinia (gestión de estado)
- Axios (servicios HTTP centralizados)
- Bootstrap (UI)
- Netlify (frontend)
- Render (backend con Express + MongoDB Atlas)

---

## ⚙️ Configuración de entorno
Crear un archivo `.env` en la raíz del proyecto:

```env
# Desarrollo local
VITE_API_URL=http://localhost:4000

# Producción (Netlify)
VITE_API_URL=https://carrito-api-express.onrender.com


## Instalación
```sh
npm install
```


## Scripts disponibles
```sh
npm run dev      # Desarrollo con hot reload
npm run build    # Compilar para producción
npm run preview  # Preview local del build
```


## Estructura del proyecto
```sh
src/
├─ components/         # Navbar, Footer, FeedbackGlobal, etc.
├─ views/              # HomeView, CarritoView, PagoView, PerfilView, etc.
├─ store/              # Pinia stores (auth, carrito, orden, pago)
├─ services/           # Axios services (api.js, carritoApi.js, etc.)
├─ router/             # Vue Router config
└─ main.js             # Entry point
```
