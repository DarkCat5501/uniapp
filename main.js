import {
  include,
  loadScripts,
  loadStyles,
  replaceIncludes,
} from "./scripts/nilla.js";
import { router } from "./scripts/router.js";
import { authStore } from "./scripts/auth.js";

window.onload = async function () {
  let currentRoute = router.load(
    router.page === "login" && authStore.isLoggedIn ? "main" : undefined,
  );

  //render page
  const { elements, scripts, styles } = await include(currentRoute);
  loadScripts(scripts);
  loadStyles(styles);
  app.insert(elements);

  await replaceIncludes(app);
};
