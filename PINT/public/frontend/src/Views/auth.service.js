import axios from "axios";
class AuthService {
  login(email, password) {
    return axios
      .post("https://pint-web-htw2.onrender.com/user/login", { email, password })
      .then(
        (res) => {
          if (res.data.token) {
            localStorage.setItem("user", JSON.stringify(res.data));
          }
          return res.data;
        },
        (reason) => {
          throw new Error("Utilizador Inválido");
        }
      );
  }
  logout() {
    localStorage.removeItem("user");
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
}
export default new AuthService();
