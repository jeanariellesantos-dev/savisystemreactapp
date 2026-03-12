// src/types/orderItem.ts

export type OrderItem = {
  id: string;
  categoryId: number | null;
  categoryName?: string;
  productId: number | null;
  productName?: string;
  unitId: number | null;
  unitName?: string;
  quantity: number;
};
