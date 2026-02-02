import RequestsTab from "../common/RequestsTab";
import { useModal } from "../../hooks/useModal";
import { useRequests } from "../../hooks/useRequests";
import RequestsTable from "../requests//RequestsTable";
import CreateOrderModal from "../requests/CreateOrderModal";
import ViewOrderModal from "../common/ViewOrderModal";
import { Request } from "../../types/request";
import { useState } from "react";
import { confirmRequest } from "../../services/orderService";
import { isOperations } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { createOrder } from "../../services/orderService";
import { markRequestAsShipped, markRequestAsReceived } from "../../services/shipmentService";
import { ShipmentForm } from "../../types/shipment";

export default function RecentRequests() {
  const { requests, loading, error, refreshRequests } = useRequests();
  const { isOpen, openModal, closeModal } = useModal();
  const [selected, setSelected] = useState<Request | null>(null);
  const { showToast } = useToast();

 const handleConfirmRequest = async ({
  requestId,
  action,
  remarks,
}: {
  requestId: number;
  action: "APPROVED" | "REJECTED";
  remarks?: string;
}) => {
  try {
    await confirmRequest({ requestId, action, remarks });

    showToast(
      action === "APPROVED"
        ? "Request approved successfully"
        : "Request rejected successfully",
      "success"
    );

    setSelected(null);
    refreshRequests();  // refresh list
  } catch (error) {
       showToast("Failed to process request", "error");
    console.error(error);
  }
};


const handleCreateOrder = async (items: {
    productId: string;
    quantity: number;
  }[]) => {
    try {
      const payload = {
        status: "PENDING_ACCOUNTING",
        items: items.map((i) => ({
          product_id: Number(i.productId),
          quantity: i.quantity,
        })),
      };

      await createOrder(payload);

      showToast("Order created successfully", "success");
      closeModal();
      refreshRequests();
    } catch (err) {
      console.error(err);
      showToast("Failed to create order", "error");
    }
  };

  const handleShipRequest = async ({
    requestId,
    shipments,
    remarks,
      }: {
        requestId: number;
        shipments: ShipmentForm[];
        remarks?: string;
      }) => {
        try {
          await markRequestAsShipped(requestId, {
            shipments: shipments.map((s) => ({
              shipped_date: s.shipped_date,
              tracking_link: s.tracking_link,
            })),
            remarks,
          });

          showToast("Request marked as shipped", "success");
          refreshRequests();
          setSelected(null);
        } catch (err) {
          console.error(err);
          showToast("Failed to mark request as shipped", "error");
        }
      };

    const handleReceiveRequest = async ({
    requestId,
    shipments,
    remarks,
      }: {
        requestId: number;
        shipments: ShipmentForm[];
        remarks?: string;
      }) => {
        try {
          await markRequestAsReceived(requestId,{
               shipments: shipments.map((s) => ({
              shipped_date: s.shipped_date,
              tracking_link: s.tracking_link,
            })),
            remarks,
          });

          showToast("Request marked as received", "success");
          refreshRequests();
          setSelected(null);
        } catch (err) {
          console.error(err);
          showToast("Failed to mark request as received", "error");
        }
      };
  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Active Orders
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <RequestsTab />
          {isOperations() && (
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Order
            </button>
          )}

        </div>
      </div>

      <RequestsTable
        requests={requests}
        onView={setSelected}
      />

      <CreateOrderModal isOpen={isOpen} onClose={closeModal}   onSubmit={handleCreateOrder} />

      {selected && (
        <ViewOrderModal
          isOpen={true}
          request={selected}
          onClose={() => setSelected(null)}
          onConfirm={handleConfirmRequest}
          onShip={handleShipRequest}
          onReceive={handleReceiveRequest}
        
        />
      )}
    </div>
  );
}
