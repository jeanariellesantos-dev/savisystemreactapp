import URL_API from "../components/api/axios";
import { Product, ProductPayload } from "../types/product";
import { Category, CategoryPayload } from "../types/category";
import { Dealership, DealershipPayload } from "../types/dealership";
import { Role, RolePayload } from "../types/role";
import { RequestStatusFigures } from "../types/dashboard";
import { Request } from "../types/request";
import { CreateOrderPayload, ConfirmRequestPayload } from "../types/request";
import { CreateShipmentPayload } from "../types/shipment";

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
   REQUESTS
========================================================= */

export const RequestService = {

  /* ===============================
     ADMIN REQUESTS
  =============================== */
  async getAll(params?: {
    page?: number;
    search?: string;
    filter?: "ACTIVE" | "ALL";
  }): Promise<any> {

    const { page = 1, search = "", filter = "ALL" } = params || {};

    const status =
      filter === "ACTIVE"
        ? "active"
        : "";

    const { data } = await URL_API.get("/admin/requests", {
      params: {
        page,
        search,
        status,
      },
    });

    return data;
  },

  async create(payload: CreateOrderPayload): Promise<Request> {
    const { data } = await URL_API.post("/admin/requests", payload);
    return data;
  },

  async update(id: number, payload: CreateOrderPayload): Promise<Request> {
    const { data } = await URL_API.put(`/admin/requests/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await URL_API.delete(`/admin/requests/${id}`);
  },
};

/* =========================================================
   USERS
========================================================= */

export const UserService = {
  async getAll(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<any> {
    const res = await URL_API.get("/admin/users", {
      params, 
    });

    return res.data;
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
  async getAll(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<any> {
    const res = await URL_API.get("/admin/products", {
      params, 
    });

    return res.data;
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
  async getAll(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<any> {
    const res = await URL_API.get("/admin/categories", {
      params, // ✅ THIS IS THE FIX
    });

    return res.data;
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
  async getAll(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<any> {
    const res = await URL_API.get("/admin/dealerships", {
      params, 
    });

    return res.data;
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
  async getAll(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<any> {
    const res = await URL_API.get("/admin/roles", {
      params,
    });

    return res.data;
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


/* =========================================================
   REQUEST WORKFLOW (USER)
========================================================= */
export const RequestWorkflowService = {

  async approve({
    requestId,
    action,
    remarks,
    items,
  }: ConfirmRequestPayload) {

    return await URL_API.post(
      `/admin/requests/${requestId}/approve`,
      {
        action,
        remarks: remarks ?? null,
        items: items ?? [],
      }
    );

  },

  async fulfill(
    requestId: number,
    payload: CreateShipmentPayload
  ) {
    const { data } = await URL_API.post(
      `admin/requests/${requestId}/fulfill`,
      payload
    );

    return data;
  },

  async receive(
    requestId: number,
    payload: CreateShipmentPayload
  ) {
    const { data } = await URL_API.post(
      `admin/requests/${requestId}/receive`,
      payload
    );

    return data;
  },

};

/* =========================================================
  INVENTORY MOVEMENT
========================================================= */

export const InventoryService = {

  /* ================= GET ALL ================= */
  getAll: async (params: any) => {
    const response = await URL_API.get("admin/inventory", {
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


    /* ================= REVERSE ================= */
  reverse: async (id: number) => {
    const response = await URL_API.post(`/admin/inventory/${id}/reverse`);
    return response.data;
  },


};