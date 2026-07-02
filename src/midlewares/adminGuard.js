export function adminGuard(to, from, next) {
  const user = JSON.parse(localStorage.getItem("user"));


  if (to.meta.requiresAdmin && (!user || user.rol !== "admin")) {
    next("/");
  } else {
    next();
  }
}
