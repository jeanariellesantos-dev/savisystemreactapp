import URL_API from "../components/api/axios";

import { Category, CategoryPayload } from "../types/category";

/* =========================
   SERVICE
========================= */

export const CategoryService = {
  /* ===== GET ALL ===== */
  async getAll(): Promise<Category[]> {
    const { data } = await URL_API.get("/categories");
    return data;
  },

};
