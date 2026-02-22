import { httpClient } from "./httpClient.js";

export const roomApi = {
  async list(params) {
    const res = await httpClient.get("/rooms", { params });
    return res.data;
  },
  async create(data) {
    const res = await httpClient.post("/rooms", data);
    return res.data;
  },
  async update(id, data) {
    const res = await httpClient.put(`/rooms/${id}`, data);
    return res.data;
  },
  async remove(id) {
    await httpClient.delete(`/rooms/${id}`);
  },
};


