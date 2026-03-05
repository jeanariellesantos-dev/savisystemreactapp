export type Dealership = {
  id: number;
  dealership_name: string;
  location: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type DealershipPayload = {
  dealership_name: string;
  location: string;
  is_active: boolean;
};
