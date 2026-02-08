// src/types/orderItem.ts

export type OrderItem = {
  id: string;
  categoryId: number | null;
  productId: number | null;
  unitId: number | null;
  quantity: number;
};
