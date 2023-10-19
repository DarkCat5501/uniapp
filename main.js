import {
  include,
  loadScripts,
  loadStyles,
  stripScripts,
  stripStyles,
  toElement,
} from "./scripts/nilla.js";
import { router } from "./scripts/router.js";

window.onload = async function() {
  const pageData = await include(router.load());
  const page = toElement(pageData);

  const scripts = stripScripts(page);
  const styles = stripStyles(page);

  loadScripts(scripts);
  loadStyles(styles);

  app.insert(page);
};
