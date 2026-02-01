// utils/statusHelpers.ts
import { RequestStatus } from "../../types/status";
import { STATUS_BADGE_MAP } from "./statusBadge";

export function getStatusBadgeColor(status: RequestStatus) {
  return STATUS_BADGE_MAP[status] ?? "warning";
}

export function formatStatusLabel(status: string) {

  return status.replace(/_/g, " ");
}