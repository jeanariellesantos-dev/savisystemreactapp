import URL_API from "../components/api/axios";
import { Role, RolePayload } from "../types/role";

export const RoleService = {
  async getAll(): Promise<Role[]> {
    const { data } = await URL_API.get("/roles");
    return data;
  },

  async create(payload: RolePayload): Promise<Role> {
    const { data } = await URL_API.post("/roles", payload);
    return data;
  },

  async update(id: number, payload: RolePayload): Promise<Role> {
    const { data } = await URL_API.put(`/roles/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await URL_API.delete(`/roles/${id}`);
  },
};
