import { include, toElement } from "./scripts/nilla.js";
import { router } from "./scripts/router.js";

window.onload = async function() {
  const pageData = await include(router.load());
  const page = toElement(pageData);
  app.insert(page);
};
