import { createApp } from 'vue'
import App from './layout/App.vue'
import router from './router'
import pinia from './store'


// Importa tus estilos globales
import './assets/base.css'
import './assets/main.css'
import './assets/perfil.css'
import './assets/pagoView.css'
import './assets/ordenDetalleView.css'
import './assets/misComprasView.css'
import './assets/footer.css'
import './assets/loginModal.css'
import './assets/panelAdmin.css'
import './assets/redesSociales.css'
import './assets/menuCategoriasView.css'
import './assets/modalProducto.css'
import './assets/logoEmpresa.css'
import './assets/carritoView.css'


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';





createApp(App).use(router).use(pinia).mount('#app')
