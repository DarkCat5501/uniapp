export class Router {
  constructor(routes) {
    this.routes = routes;
  }
  get params() {
    const params = new URLSearchParams(window.location.search);

    return params;
  }

  get page() {
    return this.params.page;
  }

  load() {
    const page = this.page;
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
