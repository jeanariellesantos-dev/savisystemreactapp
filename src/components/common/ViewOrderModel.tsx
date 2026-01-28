import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";

import { useState } from "react";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
type ActionType = "approve" | "reject" | null;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onApprove: (item: any) => void;
  onReject: (item: any, reason: string) => void;
};

export default function ViewRequestModal({
  isOpen,
  onClose,
  item,
  onApprove,
  onReject,
}: Props)
{
  const [confirmAction, setConfirmAction] = useState<ActionType>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Get role from localStorage
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const isOperations = role === "OPERATION" ;

  const handleConfirm = () => {
    if (confirmAction === "approve") {
      onApprove(item);
      onClose();
    }

    if (confirmAction === "reject") {
      if (!rejectReason.trim()) return; // prevent empty reason
      onReject(item, rejectReason);
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
        max-w-md p-6
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
        <div className="rounded-xl border border-gray-200/70 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/60">
        <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="font-medium text-gray-600 dark:text-gray-300">
            Request ID
            </span>
            <span className="ml-2 text-gray-900 dark:text-white">
            {item.requestID}
            </span>

            <span className="font-medium text-gray-600 dark:text-gray-300">
            Product
            </span>
            <span className="ml-2 text-gray-900 dark:text-white">
            {item.productName}
            </span>

            <span className="font-medium text-gray-600 dark:text-gray-300">
            Status
            </span>
            <span
            className={`ml-2 inline-flex w-fit px-2 py-0.5 rounded-full text-xs font-medium
                ${
                item.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : item.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }
            `}
            >
            {item.status}
            </span>

            {item.status === "Rejected" && (
            <>
                <span className="font-medium text-gray-600 dark:text-gray-300">
                Remarks
                </span>
                <span className="ml-2 text-gray-900 dark:text-white">
                {item.remarks || "No remarks provided"}
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
