import { Navigate, Outlet } from "react-router-dom";
import { getUserRole, Role, getRoleFlags } from "../components/utils/authHelper";

export default function ProtectedRoute({
  adminOnly = false,
  normalOnly = false,
  allowedRoles = [],
}: {
  adminOnly?: boolean;
  normalOnly?: boolean;
  allowedRoles?: Role[];
}) {
  
  const role = getUserRole() as Role | null;

  const {isAdministrator} = getRoleFlags ();

  if (!role) {
    return <Navigate to="/signin" replace />;
  }

  if (adminOnly && !isAdministrator) {
    return <Navigate to="/signin" replace />;
  }

  if (normalOnly && isAdministrator) {
    return <Navigate to="/signin" replace />;
  }

  // ✅ Custom role restriction
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
