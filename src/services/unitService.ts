import URL_API from "../components/api/axios";
import { Unit } from "../types/unit";

export const UnitService = {

  async getByProductId(productId: number): Promise<Unit[]> {
    const res = await URL_API.get(`/admin/units/${productId}`);
    return res.data; // ✅ unwrap
  },

  async getAll(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<any> {
    const res = await URL_API.get("/admin/units", {
      params,
    });

    return res.data;
  },

  async create(payload: Omit<Unit, "id">): Promise<Unit> {
    const { data } = await URL_API.post("admin/units", payload);
    return data;
  },

  async update(id: number, payload: Omit<Unit, "id">): Promise<Unit> {
    const { data } = await URL_API.put(`admin/units/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await URL_API.delete(`admin/units/${id}`);
  },
  
  async toggleStatus(id: number): Promise<Unit> {
    const { data } = await URL_API.patch(`/admin/units/${id}/toggle`);
    return data;
  },
};
