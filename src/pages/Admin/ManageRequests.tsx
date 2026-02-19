import RequestsTab from "../../components/common/RequestsTab";
import RequestsTable from "../../components/requests/RequestsTable";
import ViewOrderModal from "../../components/common/ViewOrderModal";
import { useRequests } from "../../hooks/useRequests";
import { useToast } from "../../context/ToastContext";
import { useState, useEffect } from "react";
import { confirmRequest } from "../../services/orderService";
import {
  markRequestAsShipped,
  markRequestAsReceived,
} from "../../services/shipmentService";
import { ShipmentForm } from "../../types/shipment";
import { Request } from "../../types/request";

export default function ManageRequests() {
  const { showToast } = useToast();

  const [selected, setSelected] = useState<Request | null>(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"ACTIVE" | "ALL">("ALL");
  const [search, setSearch] = useState("");

  const { requests, meta, loading, error, refreshRequests } =
    useRequests(filter, page);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  // ===== APPROVE / REJECT =====
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
      refreshRequests();
    } catch (err) {
      showToast("Failed to process request", "error");
      console.error(err);
    }
  };

  // ===== SHIP =====
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
      showToast("Failed to mark request as shipped", "error");
    }
  };

  // ===== RECEIVE =====
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
      showToast("Failed to mark request as received", "error");
    }
  };

  // ===== SEARCH FILTER =====
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
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
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
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50"
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
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* MODAL */}
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
