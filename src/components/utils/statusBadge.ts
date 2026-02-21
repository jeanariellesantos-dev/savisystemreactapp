// utils/statusBadge.ts
import { RequestStatus } from "../../types/status";

export type BadgeColor = "success" | "warning" | "error";

export const STATUS_BADGE_MAP: Record<RequestStatus, BadgeColor> = {
  // ⚠️ WARNING
  PENDING_ACCOUNTING: "warning",
  PENDING_SUPERVISOR: "warning",
  PENDING_INVENTORY: "warning",
  PENDING_CLUSTER_HEAD: "warning",
  SHIPPED: "warning",

  // ✅ SUCCESS
  RECEIVED: "success",
  APPROVED: "success",
  CLOSED: "success",
  COMPLETED: "success",

  // ❌ ERROR
  REJECTED: "error",
};