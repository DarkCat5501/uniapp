export class Router {
  constructor(routes) {
    this.routes = routes;
  }
  get params() {
    const params = new URLSearchParams(window.location.search);

    return params;
  }

  get page() {
    return this.params.get("page");
  }

  loadFirstPage() {
    const allroutes = Object.keys(this.routes);
    if (allroutes.length) {
      window.location.search = `?page=${allroutes[0]}`;
      return "";
    } else {
      return "./pages/404.html";
    }
  }

  load(route) {
    const page = route ? route : this.page;
    if (!page) return this.loadFirstPage();

    if (page && page in this.routes) {
      return this.routes[page];
    } else {
      return "./pages/404.html";
    }
  }

  goto(page) {
    if (page in this.routes) {
      const pageParams = new URLSearchParams(location.search);
      pageParams.set("page", page);
      location.search = pageParams;
    }
  }
}

export const router = new Router({
  login: "./pages/login.html",
  main: "./pages/main.html",
});
