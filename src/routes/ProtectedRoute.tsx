import { Navigate, Outlet } from "react-router-dom";
import { getUserRole, Role, getRoleFlags } from "../components/utils/authHelper";

export default function ProtectedRoute({
  adminOnly = false,
  normalOnly = false,
}: {
  adminOnly?: boolean;
  normalOnly?: boolean;
}) {
  
  const role = getUserRole() as Role | null;

  const {isAdministrator} = getRoleFlags ();

  if (!role) {
    return <Navigate to="/signin" replace />;
  }

  if (adminOnly && !isAdministrator) {
    return <Navigate to="*" replace />;
  }

  if (normalOnly && isAdministrator) {
    return <Navigate to="*" replace />;
  }

  return <Outlet />;
}
