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
      status === "PENDING_INVENTORY" && isInventory,

    canViewShipmentReadonly:
      status === "SHIPPED" || status === "RECEIVED",

    canMarkAsReceived:
      status === "SHIPPED" && (isOperations || isAdministrator),

    // ================= ORDER =================
    canEditOrder:
      isAccounting && status === "PENDING_ACCOUNTING",

    // ================= APPROVAL =================
    canApproveReject:
      isAdministrator ||
      (isAccounting && status === "PENDING_ACCOUNTING") ||
      (isSupervisor && status === "PENDING_SUPERVISOR") ||
      (isClusterHead && status === "PENDING_CLUSTER_HEAD"),

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