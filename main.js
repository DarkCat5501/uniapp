import {
  include,
  loadScripts,
  loadStyles,
  replaceIncludes,
} from "./scripts/nilla.js";
import { router } from "./scripts/router.js";
import { authStore } from "./scripts/auth.js";

window.onload = async function () {
  let currentRoute = router.load();
  if (router.page === "login" && authStore.isLoggedIn)
    return router.goto("main");
  else if (router.page !== "login" && !authStore.isLoggedIn)
    return router.goto("login");

  //render page
  {
    const { elements, scripts, styles } = await include(currentRoute);
    loadScripts(scripts);
    loadStyles(styles);
    app.insert(elements);
  }

  //render includes in html
  {
    const { scripts, styles } = await replaceIncludes(app);
    loadScripts(scripts);
    loadStyles(styles);
  }
};
