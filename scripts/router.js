import { include, loadScripts, loadStyles } from "./nilla.js";

export class Router {
  constructor(routes, onload, onrender, default_route) {
    this._routes = routes;
    this.onload = onload;
    this.onrender = onrender;
    this.default_route = default_route;
    this._route_map = new Map();
    this.routes;
  }

  set routes(values) {
    if (Array.isArray(values)) {
      this._routes.push(...values);
    } else if (typeof values === "object") {
      for (const [name, data] of Object.entries(values)) {
        this._routes.push({
          name,
          ...(typeof data === "string" ? { view: data } : data),
        });
      }
    }
  }

  get routes() {
    if (this._routes.length !== this._route_map.size) {
      for (const route of this._routes) {
        this._route_map.set(route.name, route);
      }
    }

    return this._route_map;
  }

  get params() {
    const params = new URLSearchParams(window.location.search);

    return params;
  }

  get currentPage() {
    return this.params.get("p");
  }

  load(route) {
    console.log("loaing ou", route);
    const nextRoute = this.routes.has(route) ? route : this.default_route;

    return this.routes.get(nextRoute);
  }

  async handle(page) {
    let next = this.load(page ? page : this.currentPage);
    const redirect = await this.onload.call(this, this.currentPage, next);

    if (redirect) {
      if (this.routes.has(redirect)) {
        next = this.routes.get(redirect);
      } else {
        next = this.routes.get(this.default_route);
      }
      console.log("[redirecting]", redirect);
    }

    await this._handle_render(next);
  }

  async _handle_render(pageData) {
    const app = document.getElementById("app");
    app.clear();
    await this.onrender(app, pageData);
  }

  async goto(page, reload = false) {
    if (reload) {
      const pageParams = new URLSearchParams(location.search);
      pageParams.set("p", page);
      location.search = pageParams;
    } else {
      window.history.pushState({}, "", `?p=${page}`);
    }
    await this.handle(page);
  }
}

export const router = new Router(
  [
    {
      name: "404",
      view: "./pages/404.html",
    },
  ],
  (_prev, _page) => "404",
  async (app, { view }) => {
    const { elements, scripts, styles } = await include(view);
    app.insert(elements);
    loadStyles(styles);
    loadScripts(scripts);
  },
  "404",
);

window.addEventListener("load", () => router.handle());

window.global = Object.assign(window.global ? window.global : {}, {
  router,
});
