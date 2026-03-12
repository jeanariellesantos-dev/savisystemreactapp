import RequestsTab from "../../components/common/RequestsTab";
import RequestsTable from "../../components/requests/RequestsTable";
import ViewOrderModal from "../../components/requests/ViewOrderModal";
import CreateOrderModal from "../../components/requests/CreateOrderModal";

import { useRequests } from "../../hooks/useRequests";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../hooks/useModal";

import { useState, useEffect } from "react";

import { confirmRequest, createOrder } from "../../services/orderService";
import {
  markRequestAsShipped,
  markRequestAsReceived,
} from "../../services/shipmentService";

import { ShipmentForm } from "../../types/shipment";
import { Request, RequestAction } from "../../types/request";
import { OrderItem } from "../../types/orderItem";
import Button from "../../components/ui/button/Button";

export default function ManageRequests() {
  const { showToast } = useToast();
  const { isOpen, openModal, closeModal } = useModal();

  const [selected, setSelected] = useState<Request | null>(null);

  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"ACTIVE" | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const { requests, meta, loading, error, refreshRequests } =
    useRequests(filter, page, true);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  /* ===============================
     APPROVE / REJECT / ON_HOLD / CANCELLED
  =============================== */
const handleConfirmRequest = async ({
  requestId,
  action,
  remarks,
  items,
}: {
  requestId: number;
  action: RequestAction;
  remarks?: string;
  items?: {
    product_id: number | null;
    unit_id: number | null;
    quantity: number;
  }[];
}) => {
  try {

    const payload = {
      requestId,
      action,
      remarks,
      items,
    };
      await confirmRequest(payload);

      const messages: Record<string, string> = {
        APPROVED: "Request approved successfully",
        REJECTED: "Request rejected successfully",
        ON_HOLD:
          action === "ON_HOLD"
            ? "Request activated successfully"
            : "Request placed on hold",
        CANCELLED: "Request cancelled successfully",
      };

      showToast(messages[action] || "Request updated successfully", "success");

      setSelected(null);
      refreshRequests();
    } catch (error) {
      console.error(error);
      showToast("Failed to process request", "error");
    }
  };

  /* ===============================
     CREATE REQUEST
  =============================== */

  const handleCreateOrder = async (items: OrderItem[]) => {
    try {
      const payload = {
        status: "PENDING_ACCOUNTING",
        items: items.map((i) => ({
          product_id: i.productId,
          unit_id: i.unitId,
          quantity: i.quantity,
        })),
      };

      await createOrder(payload);

      showToast("Request created successfully", "success");
      closeModal();
      refreshRequests();
    } catch (err) {
      console.error(err);
      showToast("Failed to create request", "error");
    }
  };

  /* ===============================
     SHIP
  =============================== */

  const handleShipRequest = async ({
    requestId,
    shipments,
    remarks,
  }: {
    requestId: number;
    shipments: ShipmentForm[];
    remarks?: string | null;
  }) => {
    try {
      await markRequestAsShipped(requestId, {
        shipments,
        remarks: remarks ?? null,
      });

      showToast("Request marked as shipped", "success");
      refreshRequests();
      setSelected(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to mark request as shipped", "error");
    }
  };

  /* ===============================
     RECEIVE
  =============================== */

  const handleReceiveRequest = async ({
    requestId,
    shipments,
    remarks,
  }: {
    requestId: number;
    shipments: ShipmentForm[];
    remarks?: string | null;
  }) => {
    try {
      await markRequestAsReceived(requestId, {
        shipments,
        remarks: remarks ?? null,
      });

      showToast("Request marked as received", "success");
      refreshRequests();
      setSelected(null);
    } catch (err) {
      console.error(err);
      showToast("Failed to mark request as received", "error");
    }
  };

  /* ===============================
     SEARCH
  =============================== */

  const filteredRequests = requests.filter((r) => {
    if (!search) return true;

    const text =
      `${r.request_id} ${r.status} ${r.requestor?.firstname ?? ""}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      
      {/* HEADER */}
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manage Requests
        </h3>

        <div className="flex items-center gap-3">

          <RequestsTab value={filter} onChange={setFilter} />

          <input
            type="text"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          />

            <Button 
              size="sm" 
              variant="primary" 
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:opacity-90 transition"
              onClick={openModal}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
              Create Request
            </Button>

        </div>
      </div>

      {/* TABLE */}
      <RequestsTable requests={filteredRequests} onView={setSelected} />

      {/* PAGINATION */}
      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            disabled={meta.current_page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 dark:text-white/90"
          >
            Previous
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-300">
            Page <span className="font-semibold">{meta.current_page}</span> of{" "}
            <span className="font-semibold">{meta.last_page}</span>
          </div>

          <button
            disabled={meta.current_page === meta.last_page}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 dark:text-white/90"
          >
            Next
          </button>
        </div>
      )}

      {/* VIEW MODAL */}
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

      {/* CREATE MODAL */}
      <CreateOrderModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
}