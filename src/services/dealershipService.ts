import URL_API from "../components/api/axios";
import { Dealership, DealershipPayload } from "../types/dealership";

export const DealershipService = {
  async getAll(): Promise<Dealership[]> {
    const { data } = await URL_API.get("/dealerships");
    return data;
  },


};
