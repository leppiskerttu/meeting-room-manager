import { httpClient } from "./httpClient.js";

export const authApi = {
  async register(data) {
    const res = await httpClient.post("/auth/register", data);
    return res.data;
  },
  async login(data) {
    const res = await httpClient.post("/auth/login", data);
    return res.data;
  },
  async refresh() {
    const res = await httpClient.post("/auth/refresh");
    return res.data;
  },
  async logout() {
    await httpClient.post("/auth/logout");
  },
};


