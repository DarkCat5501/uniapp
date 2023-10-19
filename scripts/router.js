export class Router {
  constructor(routes) {
    this.routes = routes;
  }

  get params() {
    const params = new URLSearchParams(window.location.search);
    return params;
  }

  load() {
    console.log(this.params);
  }
}

export const router = new Router();
