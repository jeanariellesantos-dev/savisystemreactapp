import URL_API from "../components/api/axios";

export const InventoryService = {

  /* ================= GET ALL ================= */
  getAll: async (params?: {
    page?: number;
    search?: string;
    dealership_id?: number;
  }) => {
    const response = await URL_API.get("/inventory", {
      params,
    });

    return response.data;
  },

  /* ================= CREATE ================= */
  create: async (data: {
    product_id: number;
    dealership_id: number;
    type: "IN" | "OUT" | "ADJUSTMENT";
    quantity: number;
    remarks?: string;
  }) => {
    const response = await URL_API.post("/inventory", data);
    return response.data;
  },

  /* ================= GET ONE ================= */
  getById: async (id: number) => {
    const response = await URL_API.get(`/inventory/${id}`);
    return response.data;
  },

  /* ================= DELETE (optional) ================= */
  delete: async (id: number) => {
    const response = await URL_API.delete(`/inventory-movements/${id}`);
    return response.data;
  },

};