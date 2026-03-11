// utils/statusBadge.ts
import { RequestStatus } from "../../types/status";

export type BadgeColor =
  | "primary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "light"
  | "dark";

export const STATUS_BADGE_MAP: Record<RequestStatus, BadgeColor> = {
  // ⚠️ Pending approvals
  PENDING_ACCOUNTING: "warning",
  PENDING_SUPERVISOR: "warning",
  PENDING_CLUSTER_HEAD: "warning",
  PENDING_INVENTORY: "warning",

  // 🚚 Shipment stage
  SHIPPED: "info",

  // ⏸ Paused
  ON_HOLD: "light",

  // ✅ Completed stages
  RECEIVED: "success",
  APPROVED: "success",
  COMPLETED: "success",
  CLOSED: "success",

  // ❌ Failed / terminated
  REJECTED: "error",
  CANCELLED: "dark",
};