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
import DatePicker from "../form/date-picker";

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
  const isClusterHead = role === "CLUSTER_HEAD";

  const today = new Date().toISOString().split("T")[0];

  const [confirmAction, setConfirmAction] = useState<ActionType>(null);

  const [actionRemarks, setActionRemarks] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [shipmentError, setShipmentError] = useState<string | null>(null);

  const [rejectError, setRejectError] = useState<string | null>(null);


  const [shipments, setShipments] = useState<ShipmentForm[]>([
    { shipped_date: today,received_date: today, tracking_link: "" },
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
        // return `Shipment #${i + 1}: Shipped date is required.`;
       return `Shipment: Shipped date is required.`;
      // if (!shipments[i].tracking_link.trim())
      //   // return `Shipment #${i + 1}: Tracking link is required.`;
      //  return `Shipment: Tracking link is required.`;
    }
    return null;
  };

const handleConfirm = async () => {
  if (!confirmAction) return;

  // ✅ REJECT VALIDATION FIRST (ONLY FOR REJECT)
  if (confirmAction === "REJECTED") {
    if (!actionRemarks.trim()) {
      setRejectError("Rejection reason is required.");
      return; // stop here — don't submit
    }
  }

  // 🔴 Validate shipment BEFORE submitting
  if (confirmAction === "SHIPPED") {
    const error = validateShipments();
    if (error) {
      setShipmentError(error);
      return;
    }
  }

  setSubmitting(true);
  setShipmentError(null);
  setRejectError(null);

  try {
    if (confirmAction === "SHIPPED") {
      await onShip({
        requestId: request.id,
        shipments,
        remarks: actionRemarks || undefined,
      });

    } else if (confirmAction === "RECEIVED") {
      await onReceive({
        requestId: request.id,
        shipments,
        remarks: actionRemarks || undefined,
      });

    } else {
      await onConfirm({
        requestId: request.id,
        action: confirmAction,
        remarks: actionRemarks || undefined,
      });
    }

    onClose();

  } finally {
    setSubmitting(false);
    setConfirmAction(null);
    setActionRemarks("");
    setShipmentError(null);
    setRejectError(null);
    setShipments([{ shipped_date: today,received_date: today, tracking_link: "" }]);
  }
};

  const canEditShipment = request.status === "PENDING_INVENTORY" && isInventory;
  const canViewShipmentReadonly =
    (request.status === "SHIPPED" || request.status === "RECEIVED");

  const canMarkAsReceived =
  request.status === "SHIPPED" && isOperations;

  const canApproveReject =
  (isAccounting && request.status === "PENDING_ACCOUNTING") ||
  (isSupervisor && request.status === "PENDING_SUPERVISOR") ||
  (isClusterHead && request.status === "PENDING_CLUSTER_HEAD");;

return (
<Modal
  isOpen={isOpen}
  onClose={onClose}
  className={`
    flex flex-col
    overflow-hidden
    rounded-3xl
    bg-white/90
    backdrop-blur-xl
    border border-gray-200/70
    shadow-xl
    dark:bg-gray-900/90
    dark:border-gray-700

    ${
      confirmAction
        ? "w-[95vw] max-w-[480px] p-6"
        : "w-[85vw] max-w-[1400px] h-[80vh]"
    }
  `}
>

{/* ================= MAIN ================= */}
{!confirmAction ? (
<>

{/* ================= HEADER WITH ACTIONS ================= */}
<div className="
  shrink-0
  flex items-center justify-between
  px-6 pt-5 pb-3
  border-b
  bg-white
  dark:bg-gray-900
">

  {/* LEFT */}
  <div className="flex items-center gap-3">
    <h2 className="text-lg font-semibold dark:text-white">
      Order Details
    </h2>

    <Badge size="sm" color={getStatusBadgeColor(request.status)}>
      {formatStatusLabel(request.status)}
    </Badge>
  </div>

  {/* RIGHT ACTION BAR */}
  <div className="flex items-center gap-2">

    {canApproveReject && (
      <>
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
      </>
    )}

    {canEditShipment && (
      <Button
        size="sm"
        onClick={() => setConfirmAction("SHIPPED")}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        🚚 Ship
      </Button>
    )}

    {canMarkAsReceived && (
      <Button
        size="sm"
        onClick={() => setConfirmAction("RECEIVED")}
        className="bg-indigo-600 text-white hover:bg-indigo-700"
      >
        📦 Receive
      </Button>
    )}

    {/* X BUTTON */}
    <button
      onClick={onClose}
      className="
        ml-5
        mb-3
        w-9 h-9 ml-1
        rounded-full
        flex items-center justify-center
        hover:bg-gray-200
        dark:hover:bg-gray-700
      "
    >
      ✕
    </button>

  </div>
</div>

{/* BODY */}
<div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">

{/* ================= LEFT : PRODUCTS ================= */}
<div className="
  flex flex-col
  h-full
  min-h-0
  rounded-2xl border
  bg-gray-50/70
  dark:bg-gray-800/50 dark:border-gray-700
  overflow-hidden
">

  {/* HEADER */}
  <div className="px-4 py-2 shrink-0 text-xs font-semibold uppercase text-gray-500">
    Products
  </div>

  {/* 🔴 10 ROW LIMIT SCROLL AREA */}
  <div className="shrink-0 overflow-hidden px-2 pb-2">

    <div
      className="
        overflow-y-auto
        rounded-lg
        border
        dark:border-gray-700
      "
      style={{
        maxHeight: "400px"   // ≈ 10 rows (each row ~42px)
      }}
    >

      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 text-xs uppercase">
          <tr>
            <th className="px-3 py-2 text-left">Product</th>
            <th className="px-3 py-2 text-center">Category</th>
            <th className="px-3 py-2 text-center">Qty</th>
            <th className="px-3 py-2 text-center">Unit</th>
          </tr>
        </thead>

        <tbody className="divide-y dark:divide-gray-700">
          {request.items.map(item => (
            <tr key={item.id} className="h-[42px]">
              <td className="px-3 py-2 font-medium dark:text-white">
                {item.product.product_name}
              </td>

              <td className="px-3 py-2 text-center text-gray-500">
                {item.product.category?.name}
              </td>

              <td className="px-3 py-2 text-center">
                {item.quantity}
              </td>

              <td className="px-3 py-2 text-center text-gray-500">
                {item.unit.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

  </div>
</div>

{/* RIGHT */}
{/* ================= RIGHT ================= */}
<div className="flex flex-col min-h-0 gap-4 overflow-hidden">

{/* ================= SHIPMENT CARD ================= */}
<div className="rounded-2xl border bg-gray-50/70 p-4 dark:bg-gray-800/50 dark:border-gray-700">
  <p className="text-xs mb-3 uppercase text-gray-500">
    Shipment
  </p>

  {(canEditShipment
    ? shipments
    : request.shipments?.length
      ? request.shipments
      : [{}]
  ).map((s: any, i: number) => (
        <div key={i} className="grid grid-cols-4 gap-3 text-sm items-start">

            {/* ================= SHIPPED DATE ================= */}
              <div className="flex flex-col">
              <label className="text-[11px] text-gray-500">Shipped</label>

              <div className="mt-1 h-[42px]">
              {canEditShipment ? (
              <input
              type="date"
              value={s?.shipped_date || ""}
              onChange={(e)=>{
              const copy=[...shipments];
              copy[i].shipped_date=e.target.value;
              setShipments(copy);
              setShipmentError(null);
              }}
              className="
              w-full h-full
              rounded-lg border px-3 text-sm
              bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700
              "
              />
              ) : (
              <div className="
              w-full h-full
              px-3 rounded-lg border
              flex items-center text-sm
              dark:border-gray-700
              ">
              {s?.shipped_date || "No yet shipped"}
              </div>
              )}
              </div>
              </div>


            {/* ================= RECEIVED DATE ================= */}
              <div className="flex flex-col">
              <label className="text-[11px] text-gray-500">Received</label>

              <div className="mt-1 h-[42px]">
              {canMarkAsReceived ? (
              <input
              type="date"
              value={s?.received_date || ""}
              onChange={(e)=>{
              const copy=[...shipments];
              copy[i].received_date=e.target.value;
              setShipments(copy);
              }}
              className="
              w-full h-full
              rounded-lg border px-3 text-sm
              bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700
              "
              />
              ) : (
              <div className="
              w-full h-full
              px-3 rounded-lg border
              flex items-center text-sm
              dark:border-gray-700
              ">
              {s?.received_date || "Not yet received"}
              </div>
              )}
              </div>
              </div>


            {/* ================= TRACKING ================= */}
              <div className="col-span-2 flex flex-col">
              <label className="text-[11px] text-gray-500">Tracking</label>

              <div className="mt-1 h-[42px]">
              {canEditShipment ? (
              <input
              type="url"
              value={s?.tracking_link || ""}
              onChange={(e)=>{
              const copy=[...shipments];
              copy[i].tracking_link=e.target.value;
              setShipments(copy);
              setShipmentError(null);
              }}
              className="
              w-full h-full
              rounded-lg border px-3 text-sm
              bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700
              "
              />
              ) : s?.tracking_link ? (
              <a
              href={s.tracking_link}
              target="_blank"
              rel="noopener noreferrer"
              className="
              w-full h-full
              px-3 rounded-lg border
              flex items-center truncate text-sm
              bg-gray-50 dark:bg-gray-900
              dark:text-blue-400 dark:border-gray-700
              text-blue-600 hover:underline
              "
              >
              {s.tracking_link}
              </a>
              ) : (
              <div className="
              w-full h-full
              px-3 rounded-lg border
              flex items-center text-sm
              text-gray-400 dark:border-gray-700
              ">
              No tracking yet
              </div>
              )}
              </div>
              </div>

        </div>
  ))}
</div>


{/* ================= REMARKS CARD ================= */}
<div className="
  flex flex-col min-h-0
  rounded-2xl border
  bg-gray-50/70
  dark:bg-gray-800/50 dark:border-gray-700
  overflow-hidden
">

  <div className="px-4 py-2 text-xs uppercase text-gray-500 shrink-0">
    Remarks
  </div>

  <div
    ref={remarksRef}
    className="flex-1 min-h-0 overflow-y-auto px-4 pb-2 space-y-3"
  >

    {request.approvals?.length ? (
      request.approvals.map((a, i) => (
        <div key={i} className="pl-3 border-l-2">
          <p className="text-sm dark:text-white">
            {a.remarks || "No remarks provided"}
          </p>
          <p className="text-[11px] text-gray-500">
            {new Date(a.created_at).toLocaleString()}
          </p>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-400 py-2">
        No remarks yet
      </p>
    )}

  </div>
</div>

</div>
</div>

</>
) : (

<>
{/* ================= CONFIRM ================= */}
<div className="flex flex-col">

<h2 className="text-lg font-semibold mb-2">
{confirmAction==="SHIPPED"?"Confirm Shipment":
confirmAction==="RECEIVED"?"Confirm Receipt":
confirmAction==="APPROVED"?"Confirm Approval":
"Confirm Rejection"}
</h2>

<p className="text-sm text-gray-500 mb-4">
This action cannot be undone.
</p>

<TextArea
value={actionRemarks}
onChange={(val)=>{
setActionRemarks(val);
if(rejectError)setRejectError(null);
}}
placeholder={
confirmAction==="REJECTED"
?"Provide rejection reason..."
:"Optional remarks..."
}
/>

{rejectError && (
<p className="mt-2 text-sm text-red-600">{rejectError}</p>
)}

<div className="mt-6 flex justify-end gap-2">
<Button size="sm" variant="outline" onClick={()=>setConfirmAction(null)}>
Cancel
</Button>

<Button
size="sm"
disabled={submitting}
onClick={handleConfirm}
className="bg-blue-600 text-white"
>
{submitting?"Processing...":"Confirm"}
</Button>
</div>

</div>
</>

)}

</Modal>
);
}
