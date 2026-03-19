import { getRoleFlags } from "./authHelper";

export const getRequestPermissions = (status: string) => {
  const {
    isAdministrator,
    isAccounting,
    isSupervisor,
    isClusterHead,
    isInventory,
    isOperations,
  } = getRoleFlags();

  return {
    // ================= SHIPMENT =================
    canEditShipment:
      status === "PENDING_INVENTORY" && (isInventory || isAdministrator),

    canMarkAsReceived:
      status === "SHIPPED" && (isOperations || isAdministrator),

    // ================= ORDER =================
    canEditOrder:
      (isAdministrator || isAccounting) && status === "PENDING_ACCOUNTING",

    // ================= APPROVAL =================
    canApproveReject:
      ((isAccounting || isAdministrator) && status === "PENDING_ACCOUNTING") ||
      ((isSupervisor  || isAdministrator) && status === "PENDING_SUPERVISOR") ||
      ((isClusterHead  || isAdministrator) && status === "PENDING_CLUSTER_HEAD"),

    hideApprovalActions: [
      "RECEIVED",
      "CANCELLED",
      "SHIPPED",
      "ON_HOLD",
    ].includes(status),

    // ================= ADMIN =================
    canCancelOnHold:
      isAdministrator &&
      [
        "PENDING_ACCOUNTING",
        "PENDING_SUPERVISOR",
        "PENDING_CLUSTER_HEAD",
        "ON_HOLD",
      ].includes(status),
  };
};