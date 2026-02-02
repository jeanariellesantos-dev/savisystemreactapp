import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

import { useState } from "react";
import TextArea from "../form/input/TextArea";
import { ShipmentForm } from "../../types/shipment";

import { Request } from "../../types/request";

import Badge from "../ui/badge/Badge";
import {
  getStatusBadgeColor,
  formatStatusLabel,
} from "../utils/statusHelper";


type ActionType = "APPROVED" | "REJECTED" | "SHIPPED"| "RECEIVED"|  null;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
  onConfirm: (payload: {
    requestId: number;
    action: "APPROVED" | "REJECTED";
    remarks?: string;
  }) => Promise<void>;
  onShip: (payload: {
    requestId: number;
    shipments: ShipmentForm[];
    remarks?: string;
  }) => Promise<void>;
    onReceive: (payload: {
    requestId: number;
    shipments: ShipmentForm[];
    remarks?: string;
  }) => Promise<void>;
};

export default function ViewRequestModal({
  isOpen,
  onClose,
  request,
  onConfirm,
  onShip,
  onReceive,
}: Props)
{
  const [confirmAction, setConfirmAction] = useState<ActionType>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shipRemarks, setShipRemarks] = useState("");
  const [receiveRemarks, setReceiveRemarks] = useState("");

  const [shipments, setShipments] = useState<ShipmentForm[]>([
  { shipped_date: "", tracking_link: ""},
]);


const addShipment = () => {
  setShipments((prev) => [
    ...prev,
    { shipped_date: "", tracking_link: "" },
  ]);
};

const updateShipment = <K extends keyof ShipmentForm>(
  index: number,
  field: K,
  value: ShipmentForm[K]
) => {
  setShipments((prev) => {
    const copy = [...prev];
    copy[index] = { ...copy[index], [field]: value };
    return copy;
  });
};

const removeShipment = (index: number) => {
  setShipments((prev) => prev.filter((_, i) => i !== index));
};




  if (!request) return null;

  // Get role from localStorage
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const isOperations = role === "OPERATION" ;

  const isInventory = role === "INVENTORY" ;

    const handleConfirm = async () => {
    if (!confirmAction || !request) return;

    setSubmitting(true);

    if (confirmAction === "SHIPPED") {
     await onShip({
      requestId: request.id,
      shipments,
      remarks: shipRemarks || undefined,
    });
    }  else if (confirmAction === "RECEIVED") {
    await onReceive({
      requestId: request.id,
      shipments,
      remarks: receiveRemarks || undefined,
    });
  }else {
        if (confirmAction === "REJECTED" && !rejectReason.trim()) return;
        await onConfirm({
        requestId: request.id,
        action: confirmAction,
        remarks: confirmAction === "REJECTED" ? rejectReason : undefined,
        });
    }
    setSubmitting(false); 
    setConfirmAction(null);
    setRejectReason("");
    setShipRemarks("");
    setReceiveRemarks("");
    
    onClose();
    };

    const canViewShipment =
    request.status === "PENDING_INVENTORY" &&
  (role === "INVENTORY" || role === "OPERATIONS");

  const canEditShipmentDetails = role === "INVENTORY";

  const canMarkAsShipped =
  request.status === "PENDING_INVENTORY" && role === "INVENTORY";

  const canMarkAsReceived =
  request.status === "SHIPPED" && isOperations;

  const canViewShipmentReadonly =
  request.status === "SHIPPED" && role === "OPERATION";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
       className="
    max-w-2xl
    rounded-3xl
    bg-white/90 backdrop-blur-xl
    border border-gray-200/70
    shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]
    dark:bg-gray-900/90
    dark:border-gray-700
    p-6 lg:p-8
  "
    >

    {/* NORMAL VIEW */}
    {!confirmAction && (
    <>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Order Details
            </h2>

        {/* DETAILS CARD */}
        <div className="mt-4 rounded-2xl
                        border border-gray-200/60
                        bg-gray-50/70
                        p-5
                        shadow-sm
                        dark:border-gray-700
                        dark:bg-gray-800/50
                        ">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">

            {/* Request ID */}
         <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Request ID
            </span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
            {request.request_id}
            </span>
            {/* Status */}
            <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Status
            </span>
            <span className="ml-2">
                    <Badge
                    size="sm"
                    color={getStatusBadgeColor(request.status)}
                    >
                    {formatStatusLabel(request.status)}
                    </Badge>
            </span>

            {/* PRODUCTS — FULL WIDTH */}
            <div className="col-span-2 pt-2">
                <h3 className="mb-4 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Products
                </h3>

            {/* Scroll Container */}
            <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1
                            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                            dark:scrollbar-thumb-gray-600">

                {request.items.length > 0 ? (
                request.items.map((p) => (
                    <div
                    key={p.id}
                     className="flex items-center justify-between
                                rounded-xl
                                border border-gray-200/60
                                bg-white
                                px-4 py-3
                                text-sm
                                shadow-sm
                                transition-all
                                hover:shadow-md hover:border-blue-300/60
                                dark:border-gray-700
                                dark:bg-gray-900
                                dark:hover:border-blue-600/40
                            "
                    >
                    <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                        {p.product.product_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                        Unit: {p.product.unit_of_measure}
                        </p>
                    </div>

                   <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                        × {p.product.quantity}
                        </span>
                    </div>
                ))
                ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-xs text-gray-500 dark:border-gray-600">
                    No products added to this request
                </div>
                )}
            </div>
            </div>


            {/* Remarks (Rejected only) */}
            {request.status === "REJECTED" && (
            <>
                <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Remarks
                </span>
                <span className="ml-2 font-semibold text-gray-900 dark:text-white">
                {request.approvals?.[request.approvals.length-1]?.remarks || "No remarks provided"}
                </span>
            </>
            )}
        </div>
        </div>

            {/* SHIPMENT DETAILS */}
            {canViewShipment && (
            <div className="
            mt-4
            rounded-2xl
            border border-blue-200/50
            bg-blue-50/40
            p-4
            dark:border-blue-600/30
            dark:bg-blue-900/10
            ">
                <h3 className="mb-4 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Shipment Details
                </h3>

                {/* Scroll Container */}
            <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1
                            scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
                            dark:scrollbar-thumb-gray-600">

                <div className="space-y-3">
                {shipments.map((s, index) => (
                    <div
                    key={index}
                    className="rounded-xl
                                border border-gray-200/70
                                bg-white
                                p-4
                                shadow-sm
                                dark:border-gray-700
                                dark:bg-gray-900
                                "
                    >
                    <div className="grid grid-cols-3 gap-3 text-sm">

                        {/* Shipped Date */}
                         <div className="col-span-1">
                        <label className="text-xs text-gray-500">Shipped Date</label>
                        <input
                            type="date"
                            value={s.shipped_date}
                            disabled={!canEditShipmentDetails}
                            onChange={(e) =>
                            updateShipment(index, "shipped_date", e.target.value)
                            }
                            className="mt-1 w-full rounded-md border p-2 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                        </div>

                        {/* Tracking URL */}
                         <div className="col-span-2">
                        <label className="text-xs text-gray-500">
                            Tracking Link
                        </label>
                        <input
                            type="url"
                            value={s.tracking_link}
                            disabled={!canEditShipmentDetails}
                            onChange={(e) =>
                            updateShipment(index, "tracking_link", e.target.value)
                            }
                            placeholder="https://..."
                            className="mt-1 w-full rounded-md border p-2 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                        />
                        </div>
                    </div>

                    {/* Remove shipment
                    {canEditShipmentDetails && shipments.length > 1 && (
                        <div className="mt-2 flex justify-end">
                        <button
                            type="button"
                            onClick={() => removeShipment(index)}
                            className="text-xs text-red-600 hover:underline"
                        >
                            Remove
                        </button>
                        </div>
                    )} */}
                    </div>
                ))}
                </div>

                </div>

                {/* {canEditShipmentDetails && (
                <button
                    type="button"
                    onClick={addShipment}
                    className="
                mt-3
                inline-flex items-center gap-1
                text-sm font-medium
                text-blue-600
                hover:text-blue-700
                dark:text-blue-400
            "
                >
                    + Add another shipment
                </button>
                )} */}
            </div>
            )}



        {/* ACTIONS */}
        <div className="mt-6 flex justify-between items-center">
        <Button size="sm" variant="outline" onClick={onClose}>
            Close
        </Button>

        {canMarkAsShipped && (
        <Button
            size="sm"
            onClick={() => setConfirmAction("SHIPPED")}
            className="
            bg-blue-600 text-white
            hover:bg-blue-700
            shadow-sm
            "
        >
            Mark as Shipped
        </Button>
        )}

        {canMarkAsReceived && (
        <Button
            size="sm"
            onClick={() => setConfirmAction("RECEIVED")}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
        >
            Mark as Received
        </Button>
        )}


        {!isOperations && !isInventory && (
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
        </div>
    </>
    )}


    {/* CONFIRMATION VIEW */}
    {confirmAction && (
    <>
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


        {confirmAction === "SHIPPED" && (
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Shipment Remarks <span className="text-gray-400">(optional)</span>
                </label>
                <TextArea
                value={shipRemarks}
                onChange={(value: string) => setShipRemarks(value)}
                placeholder="Notes about this shipment (courier, delays, condition, etc.)"
                className="w-full"
                />
            </div>
            )}


        {confirmAction === "REJECTED" && (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reason for rejection <span className="text-red-500">*</span>
            </label>
            <TextArea
            value={rejectReason}
            onChange={(value: string) => setRejectReason(value)}
            placeholder="Provide a clear reason..."
            className="w-full"
            />
        </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
        <Button
            size="sm"
            variant="outline"
            onClick={() => {
            setConfirmAction(null);
            setRejectReason("");
            }}
        >
            Cancel
        </Button>

        <Button
            size="sm"
            onClick={handleConfirm}
            disabled={
                submitting ||
                (confirmAction === "REJECTED" && !rejectReason.trim())
            }
            className={`
                text-white
                ${
                confirmAction === "SHIPPED"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : confirmAction === "APPROVED"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }
            `}
            >
            {submitting ? "Processing..." : `Yes, ${confirmAction}`}
            </Button>

        
        </div>
    </>
    )}
    </Modal>
  );
}
