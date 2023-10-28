import {
  include,
  loadScripts,
  loadStyles,
  replaceIncludes,
  toElement,
} from "./scripts/nilla.js";
import { router } from "./scripts/router.js";
import { authStore } from "./scripts/auth.js";

router.routes = {
  login: "./pages/login.html",
  main: "./pages/main.html",
};

async function redirect(prev, next) {
  if (next) {
    console.log("validanting credentials");
  } else {
    console.log("sending to loading page");
  }
  //
  // let currentRoute = router.load();
  // // if (router.page === "login" && authStore.isLoggedIn)
  // //   return router.goto("main");
  // // else if (router.page !== "login" && !authStore.isLoggedIn)
  // //   return router.goto("login");
  //
  // //render page
  // {
  //   const { elements, scripts, styles } = await include(currentRoute);
  //   loadScripts(scripts);
  //   loadStyles(styles);
  //   app.insert(elements);
  // }
  //
  // //render includes in html
  // {
  //   const { scripts, styles } = await replaceIncludes(app);
  //   loadScripts(scripts);
  //   loadStyles(styles);
  // }
}

router.onload = redirect;
