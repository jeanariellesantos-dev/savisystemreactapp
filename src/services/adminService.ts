import URL_API from "../components/api/axios";
import { Product, ProductPayload } from "../types/product";
import { Category, CategoryPayload } from "../types/category";
import { Dealership, DealershipPayload } from "../types/dealership";
import { Role, RolePayload } from "../types/role";
import { RequestStatusFigures } from "../types/dashboard";

export type DashboardRange = "7d" | "30d" | "year";

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

export const DashboardService = {
  async getStatusFigures(params?: any) {
    const { data } = await URL_API.get(
      "/admin/dashboard/request-status",
      { params }
    );
    return data;
  },

  async getMostOrderedProducts(params?: any) {
    const { data } = await URL_API.get(
      "/admin/dashboard/most-ordered-products",
      { params }
    );
    return data;
  },

  async getMonthlyRequests(params?: any) {
    const { data } = await URL_API.get(
      "/admin/dashboard/monthly-requests",
      { params }
    );
    return data;
  },

  async getAvgApprovalTime(params?: any) {
    const { data } = await URL_API.get(
      "/admin/dashboard/avg-approval-time",
      { params }
    );
    return data;
  },

  async getDeliveryLeadTime(params?: any) {
    const { data } = await URL_API.get(
      "/admin/dashboard/delivery-lead-time",
      { params }
    );
    return data;
  }
};

/* =========================================================
   USERS
========================================================= */

export const UserService = {
  async getAll(): Promise<any[]> {
    const { data } = await URL_API.get("/admin/users");
    return data;
  },

  async create(payload: any): Promise<any> {
    const { data } = await URL_API.post("/admin/users", payload);
    return data;
  },

  async update(id: number, payload: any): Promise<any> {
    const { data } = await URL_API.put(`/admin/users/${id}`, payload);
    return data;
  },

  async toggleStatus(id: number) {
    const { data } = await URL_API.patch(`/admin/users/${id}/toggle`);
    return data;
  },
};


/* =========================================================
   PRODUCTS
========================================================= */

export const ProductService = {
  async getAll(): Promise<Product[]> {
    const { data } = await URL_API.get("/admin/products");
    return data;
  },

  async create(payload: ProductPayload): Promise<Product> {
    const { data } = await URL_API.post("/admin/products", payload);
    return data;
  },

  async update(id: number, payload: ProductPayload): Promise<Product> {
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


/* =========================================================
   CATEGORIES
========================================================= */

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await URL_API.get("/admin/categories");
    return data;
  },

  async getById(id: number): Promise<Category> {
    const { data } = await URL_API.get(`/admin/categories/${id}`);
    return data;
  },

  async create(payload: CategoryPayload): Promise<Category> {
    const { data } = await URL_API.post("/admin/categories", payload);
    return data;
  },

  async update(id: number, payload: CategoryPayload): Promise<Category> {
    const { data } = await URL_API.put(`/admin/categories/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await URL_API.delete(`/admin/categories/${id}`);
  },

  async toggleStatus(id: number): Promise<void> {
    await URL_API.patch(`/admin/categories/${id}/toggle`);
  },
};


/* =========================================================
   DEALERSHIPS
========================================================= */

export const DealershipService = {
  async getAll(): Promise<Dealership[]> {
    const { data } = await URL_API.get("/admin/dealerships");
    return data;
  },

  async create(payload: DealershipPayload): Promise<Dealership> {
    const { data } = await URL_API.post("/admin/dealerships", payload);
    return data;
  },

  async update(id: number, payload: DealershipPayload): Promise<Dealership> {
    const { data } = await URL_API.put(`/admin/dealerships/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await URL_API.delete(`/admin/dealerships/${id}`);
  },

  async toggleStatus(id: number): Promise<void> {
    await URL_API.patch(`/admin/dealerships/${id}/toggle`);
  },
};


/* =========================================================
   ROLES
========================================================= */

export const RoleService = {
  async getAll(): Promise<Role[]> {
    const { data } = await URL_API.get("/admin/roles");
    return data;
  },

  async create(payload: RolePayload): Promise<Role> {
    const { data } = await URL_API.post("/admin/roles", payload);
    return data;
  },

  async update(id: number, payload: RolePayload): Promise<Role> {
    const { data } = await URL_API.put(`/admin/roles/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await URL_API.delete(`/admin/roles/${id}`);
  },

  async toggleStatus(id: number): Promise<void> {
    await URL_API.patch(`/admin/roles/${id}/toggle`);
  },
};
