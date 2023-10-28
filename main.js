import { router } from "./scripts/router.js";
import { authStore } from "./scripts/auth.js";

router.routes = {
  login: "./pages/login.html",
  main: "./pages/main.html",
};

async function redirect(prev, next) {
  const logged = authStore.isLoggedIn;
  if (next) {
    if (next.name === "login" && logged) return "main";
    return undefined;
  }

  return logged ? "main" : "login";
}

router.onload = redirect;
