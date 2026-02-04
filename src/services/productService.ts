import URL_API from "../components/api/axios";

export type Product = {
  id: number;
  product_name: string;
};

export type Unit = {
  id: number;
  name: string;
};

export const ProductService = {
  async getByCategory(categoryId: number): Promise<Product[]> {
    const { data } = await URL_API.get("/products", {
      params: { category_id: categoryId },
    });
    return data;
  },

  async getUnits(productId: number): Promise<Unit[]> {
  const res = await URL_API.get(`/products/${productId}/units`);
  return res.data; // ✅ unwrap
  },
};
