import URL_API from "../components/api/axios";
import { Dealership, DealershipPayload } from "../types/dealership";

export const DealershipService = {
  async getAll(): Promise<Dealership[]> {
    const { data } = await URL_API.get("/dealerships");
    return data;
  },

  async create(payload: DealershipPayload): Promise<Dealership> {
    const { data } = await URL_API.post("/dealerships", payload);
    return data;
  },

  async update(id: number, payload: DealershipPayload): Promise<Dealership> {
    const { data } = await URL_API.put(`/dealerships/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await URL_API.delete(`/dealerships/${id}`);
  },
};
