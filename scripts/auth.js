import { ApiPost } from "./db.js";

class Auth {
  constructor() {
    this.userData = null;
  }

  /**
   * gets the current Session token
   *@returns {string|undefined}
   * */
  get token() {
    return localStorage.getItem("token");
  }

  /**
   * @param {string} token
   * */
  setToken(token) {
    localStorage.setItem("token", token);
  }

  async logout() {
    localStorage.removeItem("token");
  }

  async login() {
    const userData = await ApiPost("signin", {
      email: "master@email.com",
      pass: "a123123123",
    });

    this.setToken(userData.token);
    delete userData.token;
    this.userData = userData;
  }

  get isLoggedIn() {
    return this.token !== null;
  }
}

export const authStore = new Auth();
