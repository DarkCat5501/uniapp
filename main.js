import {
  include,
  loadScripts,
  stripScripts,
  toElements,
} from "./scripts/nilla.js";
import { router } from "./scripts/router.js";

window.onload = async function() {
  console.log("started");
  router.load();

  const app = document.getElementById("app");

  const navElement = await include("./pages/navigation.html");
  const navBar = toElements(navElement);
  const navScripts = stripScripts(navBar);

  loadScripts(navScripts);
  app.insert(navBar);
};
