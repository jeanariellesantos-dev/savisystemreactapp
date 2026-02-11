import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { useState, useRef, useEffect } from "react";
import TextArea from "../form/input/TextArea";
import { ShipmentForm } from "../../types/shipment";
import { Request } from "../../types/request";
import Badge from "../ui/badge/Badge";
import {
  getStatusBadgeColor,
  formatStatusLabel,
} from "../utils/statusHelper";

type ActionType = "APPROVED" | "REJECTED" | "SHIPPED" | "RECEIVED" | null;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
  onConfirm: (payload: {
    requestId: number;
    action: "APPROVED" | "REJECTED";
    remarks?: string ;
  }) => Promise<void>;
  onShip: (payload: {
    requestId: number;
    shipments: ShipmentForm[];
    remarks?: string | null ;
  }) => Promise<void>;
  onReceive: (payload: {
    requestId: number;
    shipments: ShipmentForm[];
    remarks?: string | null ;
  }) => Promise<void>;
};

export default function ViewRequestModal({
  isOpen,
  onClose,
  request,
  onConfirm,
  onShip,
  onReceive,
}: Props) {
  if (!request) return null;

  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const isOperations = role === "OPERATION";
  const isInventory = role === "INVENTORY";
  const isAccounting = role === "ACCOUNTING";
  const isSupervisor = role === "SUPERVISOR";

  const today = new Date().toISOString().split("T")[0];

  const [confirmAction, setConfirmAction] = useState<ActionType>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shipRemarks, setShipRemarks] = useState("");
  const [shipmentError, setShipmentError] = useState<string | null>(null);

  const [shipments, setShipments] = useState<ShipmentForm[]>([
    { shipped_date: today, tracking_link: "" },
  ]);

  const remarksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    remarksRef.current?.scrollTo({
      top: remarksRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [request.approvals]);

  const validateShipments = () => {
    for (let i = 0; i < shipments.length; i++) {
      if (!shipments[i].shipped_date)
        return `Shipment #${i + 1}: Shipped date is required.`;
      if (!shipments[i].tracking_link.trim())
        return `Shipment #${i + 1}: Tracking link is required.`;
    }
    return null;
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setSubmitting(true);

    try {
      if (confirmAction === "SHIPPED") {
        const error = validateShipments();
        if (error) {
          setShipmentError(error);
          return;
        }
        await onShip({
          requestId: request.id,
          shipments,
          remarks: shipRemarks || null,
        });
      } else if (confirmAction === "RECEIVED") {
        await onReceive({
          requestId: request.id,
          shipments,
          remarks: shipRemarks || null,
        });
      } else {
        if (confirmAction === "REJECTED" && !rejectReason.trim()) return;
        await onConfirm({
          requestId: request.id,
          action: confirmAction,
          remarks:
            confirmAction === "REJECTED" ? rejectReason : undefined,
        });
      }
      onClose();
    } finally {
      setSubmitting(false);
      setConfirmAction(null);
      setRejectReason("");
      setShipRemarks("");
      setShipmentError(null);
      setShipments([{ shipped_date: today, tracking_link: "" }]);
    }
  };

  const canEditShipment = request.status === "PENDING_INVENTORY" && isInventory;
  const canViewShipmentReadonly =
    (request.status === "SHIPPED" || request.status === "RECEIVED") &&
    isOperations;

  const canMarkAsReceived =
  request.status === "SHIPPED" && isOperations;

  const canApproveReject =
  (isAccounting && request.status === "PENDING_ACCOUNTING") ||
  (isSupervisor && request.status === "PENDING_SUPERVISOR");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl rounded-3xl bg-white/90 backdrop-blur-xl border border-gray-200/70 p-6 shadow-xl dark:bg-gray-900/90 dark:border-gray-700"
    >
      {!confirmAction ? (
        <>
            {/* HEADER */}
            <div className="mb-6 flex items-center gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
                Order Details
            </h2>

            <Badge size="sm" color={getStatusBadgeColor(request.status)}>
                {formatStatusLabel(request.status)}
            </Badge>
            </div>

          {/* DETAILS CARD */}
          <div className="rounded-2xl border bg-gray-50/70 p-5 dark:bg-gray-800/50 dark:border-gray-700">
            {/* PRODUCTS */}
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Products
            </h3>

            <div className="max-h-[200px] space-y-2 overflow-y-auto pr-1">
              {request.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border bg-white px-4 py-3 shadow-sm dark:bg-gray-900 dark:border-gray-700"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.product.product_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} ×{" "}
                    {item.unit.name}
                  </p>
                </div>
              ))}
            </div>

            {/* SHIPMENT DETAILS */}
            {(canEditShipment || canViewShipmentReadonly) && (
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Shipment Details
                </h3>

                {(canEditShipment ? shipments : request.shipments)?.map(
                  (s, i) => (
                    <div
                      key={i}
                      className="mb-3 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900 dark:border-gray-700"
                    >
                      <p className="mb-2 text-xs font-medium text-gray-500">
                        Shipment #{i + 1}
                      </p>

                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <label className="text-[11px] text-gray-500">
                            Shipped Date
                          </label>
                          {canEditShipment ? (
                            <input
                              type="date"
                              value={s.shipped_date}
                              onChange={(e) => {
                                const copy = [...shipments];
                                copy[i].shipped_date = e.target.value;
                                setShipments(copy);
                              }}
                              className="mt-1 w-full rounded-md border p-2"
                            />
                          ) : (
                            <p className="font-medium">
                              {s.shipped_date || "—"}
                            </p>
                          )}
                        </div>

                        <div className="col-span-2">
                          <label className="text-[11px] text-gray-500">
                            Tracking Link
                          </label>
                          {canEditShipment ? (
                            <input
                              type="url"
                              value={s.tracking_link}
                              onChange={(e) => {
                                const copy = [...shipments];
                                copy[i].tracking_link = e.target.value;
                                setShipments(copy);
                              }}
                              className="mt-1 w-full rounded-md border p-2"
                            />
                          ) : s.tracking_link ? (
                            <a
                              href={s.tracking_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block truncate text-indigo-600 underline"
                            >
                              {s.tracking_link}
                            </a>
                          ) : (
                            <p className="text-gray-400">—</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* REMARKS */}
            {request.approvals?.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Remarks History
                </h3>

                <div
                  ref={remarksRef}
                  className="max-h-[96px] overflow-y-auto space-y-4 pr-2"
                >
                  {request.approvals.map((a, i) => {
                    const isLatest =
                      i === request.approvals.length - 1;
                    return (
                      <div
                        key={i}
                        className={`pl-4 border-l-2 ${
                          isLatest
                            ? "border-blue-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">
                          {a.remarks || "No remarks provided"}
                        </p>
                        <p className="mt-1 text-[11px] tracking-wide text-gray-500">
                          {new Date(a.created_at).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex justify-between items-center">
          
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>

          {canApproveReject && (
            <div className="flex gap-2">
            <Button
                size="sm"
                onClick={() => setConfirmAction("REJECTED")}
                className="bg-red-500 text-white hover:bg-red-600"
            >
                Reject
            </Button>

            <Button
                size="sm"
                onClick={() => setConfirmAction("APPROVED")}
                className="bg-green-500 text-white hover:bg-green-600"
            >
                Approve
            </Button>
            </div>
        )}

            {canEditShipment && (
              <Button
                size="sm"
                className="bg-blue-600 text-white shadow-md hover:bg-blue-700"
                onClick={() => setConfirmAction("SHIPPED")}
              >
                🚚 Mark as Shipped
              </Button>
            )}

            {canMarkAsReceived && (
              <Button
                size="sm"
                className="bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                onClick={() => setConfirmAction("RECEIVED")}
              >
                Mark as Received
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {/* CONFIRMATION */}

         <h2 className="text-lg font-semibold mb-2">
            {confirmAction === "SHIPPED"
                ? "Confirm Shipment"
                : confirmAction === "RECEIVED"
                ? "Confirm Receipt"
                : `Confirm ${confirmAction}`}
            </h2>

            <p className="text-sm text-gray-600 mb-4">
            {confirmAction === "SHIPPED"
                ? "This will mark the request as shipped."
                : confirmAction === "RECEIVED"
                ? "This will confirm that the shipment has been received."
                : "This action cannot be undone."}
            </p>

          {confirmAction === "REJECTED" && (
            <TextArea
              value={rejectReason}
              onChange={setRejectReason}
              placeholder="Provide a clear reason..."
            />
          )}

          {(confirmAction === "SHIPPED" ||
            confirmAction === "RECEIVED") && (
            <TextArea
              value={shipRemarks}
              onChange={setShipRemarks}
              placeholder="Optional shipment remarks..."
            />
          )}

          {shipmentError && (
            <div className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
              {shipmentError}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={submitting}
              onClick={handleConfirm}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {submitting ? "Processing..." : "Confirm"}
            </Button>
          </div>
       
       
        </>
        
      )}

    </Modal>
  );
}
