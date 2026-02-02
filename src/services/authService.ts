export type UserRole =
  | "OPERATION"
  | "ACCOUNTING"
  | "SUPERVISOR"
  | "INVENTORY"
  | null;

export const getUserRole = (): UserRole => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role") as UserRole;
};

export const isOperations = (): boolean => {
  return getUserRole() === "OPERATION";
};