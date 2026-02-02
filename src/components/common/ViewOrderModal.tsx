import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

import { useState } from "react";
import TextArea from "../form/input/TextArea";

import { Request } from "../../types/request";

import Badge from "../ui/badge/Badge";
import {
  getStatusBadgeColor,
  formatStatusLabel,
} from "../utils/statusHelper";

type ActionType = "approve" | "reject" | null;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  request: Request | null;
  onApprove: (request: any) => void;
  onReject: (request: any, reason: string) => void;
};

export default function ViewRequestModal({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}: Props)
{
  const [confirmAction, setConfirmAction] = useState<ActionType>(null);
  const [rejectReason, setRejectReason] = useState("");

  if (!request) return null;

  // Get role from localStorage
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const isOperations = role === "OPERATION" ;

  const handleConfirm = () => {
    if (confirmAction === "approve") {
      onApprove(request);
      onClose();
    }

    if (confirmAction === "reject") {
      if (!rejectReason.trim()) return; // prevent empty reason
      onReject(request, rejectReason);
      onClose();
    }

    setConfirmAction(null);
    setRejectReason("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="
        max-w-xl p-6
        bg-white backdrop-blur-xl
        border border-white/30 shadow-xl
        dark:bg-gray-900 lg:p-11
      "
    >

    {/* NORMAL VIEW */}
    {!confirmAction && (
    <>
        <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
        Order Details
        </h2>

        {/* DETAILS CARD */}
        <div className="rounded-2xl border border-gray-200/70 bg-gray-50 p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/60">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">

            {/* Request ID */}
            <span className="font-medium text-gray-600 dark:text-gray-300">
            Request ID
            </span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
            {request.request_id}
            </span>

            {/* Status */}
            <span className="font-medium text-gray-600 dark:text-gray-300">
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
            <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
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
                    className="
                        flex items-center justify-between
                        rounded-xl border border-gray-200
                        bg-white px-4 py-2 text-sm shadow-sm
                        transition-all duration-200 ease-in-out
                        hover:bg-blue-50 hover:border-blue-200 hover:shadow-md
                        dark:border-gray-700 dark:bg-gray-900
                        dark:hover:bg-gray-800 dark:hover:border-blue-600/50
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

                    <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
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
                <span className="font-medium text-gray-600 dark:text-gray-300">
                Remarks
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                {request.approvals.remarks || "No remarks provided"}
                </span>
            </>
            )}
        </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-between items-center">
        <Button size="sm" variant="outline" onClick={onClose}>
            Close
        </Button>

        {!isOperations && (
            <div className="flex gap-2">
            <Button
                size="sm"
                onClick={() => setConfirmAction("reject")}
                className="bg-red-500 text-white hover:bg-red-600"
            >
                Reject
            </Button>

            <Button
                size="sm"
                onClick={() => setConfirmAction("approve")}
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
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        Confirm {confirmAction === "approve" ? "Approval" : "Rejection"}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        This action cannot be undone. Are you sure you want to proceed?
        </p>

        {confirmAction === "reject" && (
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
            disabled={confirmAction === "reject" && !rejectReason.trim()}
            className={`text-white
            ${
                confirmAction === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
            `}
        >
            Yes, {confirmAction}
        </Button>
        </div>
    </>
    )}

    </Modal>
  );
}
