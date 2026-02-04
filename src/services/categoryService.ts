import URL_API from "../components/api/axios";

export type Category = {
  id: number;
  name: string;
};

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await URL_API.get("/categories");
    return data;
  },
};
