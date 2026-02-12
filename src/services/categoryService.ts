import URL_API from "../components/api/axios";

/* =========================
   TYPES
========================= */

export type Category = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CategoryPayload = {
  name: string;
  slug: string;
  is_active: boolean;
};

export type CategoryForm = {
  name: string;
  slug: string;
  is_active: boolean;
};


/* =========================
   SERVICE
========================= */

export const CategoryService = {
  /* ===== GET ALL ===== */
  async getAll(): Promise<Category[]> {
    const { data } = await URL_API.get("/categories");
    return data;
  },

  /* ===== GET ONE ===== */
  async getById(id: number): Promise<Category> {
    const { data } = await URL_API.get(`/categories/${id}`);
    return data;
  },

  /* ===== CREATE ===== */
  async create(payload: CategoryPayload): Promise<Category> {
    const { data } = await URL_API.post("/categories", payload);
    return data;
  },

  /* ===== UPDATE ===== */
  async update(id: number, payload: CategoryPayload): Promise<Category> {
    const { data } = await URL_API.put(`/categories/${id}`, payload);
    return data;
  },

  /* ===== DELETE ===== */
  async delete(id: number): Promise<void> {
    await URL_API.delete(`/categories/${id}`);
  },

  /* ===== TOGGLE ACTIVE ===== */
  async toggleStatus(id: number): Promise<Category> {
    const { data } = await URL_API.patch(`/categories/${id}/toggle`);
    return data;
  },
};
