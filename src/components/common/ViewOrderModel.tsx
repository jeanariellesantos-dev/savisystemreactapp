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
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white/90">
            Order Details
          </h2>

          <div className="space-y-2 text-sm text-gray-800">
            <p> <strong>Request ID: </strong> {item.requestID}</p>
            <p> <strong>Product: </strong> {item.productName}</p>
            <p><strong>Status:</strong> {item.status}</p>
             {/* SHOW REMARKS ONLY IF STATUS IS REJECTED */}
            {item.status === "REJECTED" && (
              <p>
                <strong>Remarks:</strong> {item.remarks || "No remarks yet"}
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button
            size="sm" variant="outline"
              onClick={onClose}
            >
              Close
            </Button>

         {!isOperations && (
            <>
            <Button
              onClick={() => setConfirmAction("reject")}
              className="px-4 py-2 text-sm
                         bg-red-500/80 text-white
                         hover:bg-red-600 transition"
            >
              Reject
            </Button>

            <Button
              onClick={() => setConfirmAction("approve")}
              className="px-4 py-2 text-sm
                         bg-green-500/80 text-white
                         hover:bg-green-600 transition"
            >
              Approve
            </Button>
              </>
             )}
          </div>

        </>
      )}

      {/* CONFIRMATION VIEW */}
      {confirmAction && (
        <>
          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Confirm Action
          </h2>

          <p className="text-sm text-gray-800 mb-3">
            Are you sure you want to{" "}
            <span className="font-semibold capitalize">
              {confirmAction}
            </span>{" "}
            this request?
          </p>

          {/* Reject reason input */}
          {confirmAction === "reject" && (
            <TextArea
              value={rejectReason}
              onChange={(value: string) => setRejectReason(value)}
              placeholder="Type your reason for rejection..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Button
            size="sm" variant="outline"
              onClick={() => {
                setConfirmAction(null);
                setRejectReason("");
              }}
              className="px-4 py-2 text-sm
                         bg-white/70 border border-gray-300
                         hover:bg-white transition"
            >
              No
            </Button>

            <Button
              onClick={handleConfirm}
              className={`px-4 py-2 text-sm text-white transition
                ${confirmAction === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"}
              `}
            >
              Yes
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
