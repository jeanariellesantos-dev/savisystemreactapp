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
};

export type CategoryForm = {
  name: string;
  slug: string;
};