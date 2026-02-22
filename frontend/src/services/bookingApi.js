import { httpClient } from "./httpClient.js";

export const bookingApi = {
  async create(data) {
    const res = await httpClient.post("/bookings", data);
    return res.data;
  },
  async myBookings() {
    const res = await httpClient.get("/bookings/me");
    return res.data;
  },
  async allBookings() {
    const res = await httpClient.get("/bookings");
    return res.data;
  },
  async cancel(id) {
    await httpClient.delete(`/bookings/${id}`);
  },
};


