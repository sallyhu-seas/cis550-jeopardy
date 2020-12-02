import Apis from "./apis";

export default {
  login(body) {
    return Apis("POST", "/auth/login", body);
  },
  register(body) {
    return Apis("POST", "/auth/register", body);
  }
};
