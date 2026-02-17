import URL_API from "../components/api/axios";
import { Role, RolePayload } from "../types/role";

export const RoleService = {
  async getAll(): Promise<Role[]> {
    const { data } = await URL_API.get("/roles");
    return data;
  },
};
