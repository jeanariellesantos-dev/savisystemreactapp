import URL_API from "../components/api/axios";
import { Product, ProductPayload } from "../types/product";
import { Category, CategoryPayload } from "../types/category";

//User
export const getUsers = () => {
  return URL_API.get("/admin/users");
};

export const toggleUserStatus = (id: number) => {
  return URL_API.patch(`/admin/users/${id}/toggle`);
};

export const updateUser = (id: number, data: any) => {
  return URL_API.put("/admin/users/${id}", data);
};

//Product 
export const adminProductService = {
  async getAll(): Promise<Product[]> {
    const { data } = await URL_API.get("/admin/products");
    return data;
  },

  async create(payload: any): Promise<Product> {
    const { data } = await URL_API.post("/admin/products", payload);
    return data;
  },

  async update(id: number, payload: any): Promise<Product> {
    const { data } = await URL_API.put(`/admin/products/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await URL_API.delete(`/admin/products/${id}`);
  },

  async toggleStatus(id: number): Promise<void> {
    await URL_API.patch(`/admin/products/${id}/toggle-status`);
  },
};


//Categories
export const CategoryService = {
  /* ===== GET ALL ===== */
  async getAll(): Promise<Category[]> {
    const { data } = await URL_API.get("admin/categories");
    return data;
  },

  /* ===== GET ONE ===== */
  async getById(id: number): Promise<Category> {
    const { data } = await URL_API.get(`admin/categories/${id}`);
    return data;
  },

  /* ===== CREATE ===== */
  async create(payload: CategoryPayload): Promise<Category> {
    const { data } = await URL_API.post("admin/categories", payload);
    return data;
  },

  /* ===== UPDATE ===== */
  async update(id: number, payload: CategoryPayload): Promise<Category> {
    const { data } = await URL_API.put(`admin/categories/${id}`, payload);
    return data;
  },

  /* ===== DELETE ===== */
  async delete(id: number): Promise<void> {
    await URL_API.delete(`admin/categories/${id}`);
  },

  /* ===== TOGGLE ACTIVE ===== */
  async toggleStatus(id: number): Promise<Category> {
    const { data } = await URL_API.patch(`admin/categories/${id}/toggle`);
    return data;
  },
};
