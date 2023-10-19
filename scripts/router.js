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

  load() {
    const page = this.page;
    if (!page) return this.loadFirstPage();

    if (page && page in this.routes) {
      return this.routes[page];
    } else {
      return "./pages/404.html";
    }
  }
}

export const router = new Router({
  main: "./pages/main.html",
});
