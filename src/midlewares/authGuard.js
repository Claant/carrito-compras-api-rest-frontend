export function authGuard(to, from, next) {
  const user = JSON.parse(localStorage.getItem("user")); // lee el objeto completo

  if (to.meta.requiresAuth && !user) {
    next("/login");
  } else {
    next();
  }
}
