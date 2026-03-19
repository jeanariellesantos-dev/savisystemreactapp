export type Role =
  | "OPERATION"
  | "ACCOUNTING"
  | "SUPERVISOR"
  | "INVENTORY"
  | "ADMINISTRATOR"
  | "CLUSTER_HEAD"
  | null;

export const getUserRole = (): Role => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role") as Role;
};

export const getRoleFlags = () => {
  const role = getUserRole();

  return {
    role,
    isOperations: role === "OPERATION",
    isAccounting: role === "ACCOUNTING",
    isSupervisor: role === "SUPERVISOR",
    isInventory: role === "INVENTORY",
    isAdministrator: role === "ADMINISTRATOR",
    isClusterHead: role === "CLUSTER_HEAD",
  };
};

export const getPermissions = () => {
  const {
    isAdministrator,
    isAccounting,
    isSupervisor,
    isClusterHead,
    isInventory,
    isOperations,
  } = getRoleFlags();

  return {
    canApprove:
      isAdministrator ||
      isAccounting ||
      isSupervisor ||
      isClusterHead,

    canEditOrder: isAccounting,

    canShip: isInventory,

    canReceive: isOperations || isAdministrator,
  };
};