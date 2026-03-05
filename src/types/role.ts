export type Role = {
  id: number;
  role_name: string;
  role_description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type RolePayload = {
  role_name: string;
  role_description: string;
  is_active: boolean;
};
