import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CarritoView from "../views/CarritoView.vue";
import PagoView from "../views/PagoView.vue";
import { authGuard } from "../midlewares/authGuard.js";
import PerfilView from "../views/PerfilView.vue";
import CategoriaView from "../views/CategoriaView.vue";
import MisComprasView from "../views/MisComprasView.vue";
import OrdenDetalleView from "../views/OrdenDetalleView.vue";
import RegistroUsuarioModal from "../components/RegistroUsuarioModal.vue";
import { adminGuard } from "../midlewares/adminGuard.js";


const routes = [
  { path: "/", name: "home", component: HomeView },

  // 🔒 protegida con requiresAuth
  { path: "/carrito", name: "carrito", component: CarritoView, meta: { requiresAuth: true } },
  { path: "/mis-compras", name: "mis-compras", component: MisComprasView, meta: { requiresAuth: true } },
  { path: "/orden/:id", name: "OrdenDetalle", component: OrdenDetalleView, props: true },

  // 🔒 protegida con requiresAuth
  { path: "/pago", name: "pago", component: PagoView, meta: { requiresAuth: true } },

  { path: "/registro", name: "registro", component: RegistroUsuarioModal },
  { path: "/categoria/:nombre", name: "categoria", component: CategoriaView, props: true },
  { path: "/perfil", name: "perfil", component: PerfilView },
  { path: "/buscar/:nombre", name: "buscar", component: CategoriaView },
    {
  path: "/admin",
  component: () => import("../views/AdminPanel.vue"),
  meta: { requiresAdmin: true },
  children: [
    {
      path: "productos",
      component: () => import("../views/AdminProductos.vue")
    },
    {
      path: '/admin/usuarios',
  name: 'AdminUsuarios',
  component: () => import('@/views/AdminUsuarios.vue')
    },
    {
      path: "reportes",
      name: "admin-reportes-base",
      component: () => import("../views/AdminReportes.vue")
    },
    {
      path: "reportes/:tipo",
      name: "admin-reportes",
      component: () => import("../views/AdminReportes.vue"),
      props: true
    },
  ]
},



  // fallback para rutas no encontradas
  { path: "/:pathMatch(.*)*", redirect: "/" }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Aplica el middleware global
router.beforeEach(authGuard);
router.beforeEach(adminGuard);

export default router;
