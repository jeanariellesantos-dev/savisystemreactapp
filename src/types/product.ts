import { Unit } from "./unit";

export type ProductUnit = {
  unit_id: number;
  is_default: boolean;
};

export type Product = {
  id: number;
  product_name: string;
  description?: string;
  category_id: number;
  is_active: boolean;
  category?: { id: number; name: string };
  units?: Unit[];
};

export type ProductPayload = {
  product_name: string;
  description?: string;
  category_id: number;
  units: ProductUnit[];
};
