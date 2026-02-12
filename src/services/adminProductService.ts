import URL_API from "../components/api/axios";
import { Product, ProductPayload } from "../types/product";

export const adminProductService = {
  async getAll(): Promise<Product[]> {
    const { data } = await URL_API.get("/products");
    return data;
  },

  async create(payload: ProductPayload): Promise<Product> {
    const { data } = await URL_API.post("/products", payload);
    return data;
  },

  async update(id: number, payload: ProductPayload): Promise<Product> {
    const { data } = await URL_API.put(`/products/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await URL_API.delete(`/products/${id}`);
  },
};
