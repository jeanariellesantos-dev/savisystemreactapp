import { Navigate, Outlet } from "react-router-dom";

type Role =
  | "ADMINISTRATOR"
  | "OPERATION"
  | "ACCOUNTING"
  | "SUPERVISOR"
  | "INVENTORY";

export default function ProtectedRoute({
  adminOnly = false,
  normalOnly = false,
}: {
  adminOnly?: boolean;
  normalOnly?: boolean;
}) {
  const role = localStorage.getItem("role") as Role | null;

  if (!role) {
    return <Navigate to="/signin" replace />;
  }

  if (adminOnly && role !== "ADMINISTRATOR") {
    return <Navigate to="*" replace />;
  }

  if (normalOnly && role === "ADMINISTRATOR") {
    return <Navigate to="*" replace />;
  }

  return <Outlet />;
}
