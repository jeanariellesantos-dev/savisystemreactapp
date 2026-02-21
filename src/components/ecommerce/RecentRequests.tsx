import RequestsTab from "../common/RequestsTab";
import { useModal } from "../../hooks/useModal";
import { useRequests } from "../../hooks/useRequests";
import RequestsTable from "../requests//RequestsTable";
import CreateOrderModal from "../requests/CreateOrderModal";
import ViewOrderModal from "../common/ViewOrderModal";
import { Request } from "../../types/request";
import { useState, useEffect} from "react";
import { confirmRequest } from "../../services/orderService";
import { isOperations } from "../../services/authService";
import { useToast } from "../../context/ToastContext";
import { createOrder } from "../../services/orderService";
import { markRequestAsShipped, markRequestAsReceived } from "../../services/shipmentService";
import { ShipmentForm } from "../../types/shipment";
import { OrderItem } from "../../types/orderItem"
import Button from "../../components/ui/button/Button";

export default function RecentRequests() {
  const { isOpen, openModal, closeModal } = useModal();
  const [selected, setSelected] = useState<Request | null>(null);
  const { showToast } = useToast();

  const [page, setPage] = useState(1);

  const [filter, setFilter] = useState<"ACTIVE" | "ALL">("ACTIVE");
  const [search, setSearch] = useState("");    

  const { requests, meta, loading, error, refreshRequests } = useRequests(filter, page);

    // ADD THIS HERE
  useEffect(() => {
    setPage(1);
  }, [filter]);

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
        remarks?: string | null;
      }) => {
        try {
          await markRequestAsShipped(requestId, {
            shipments: shipments.map((s) => ({
              shipped_date: s.shipped_date,
              tracking_link: s.tracking_link,
            })),
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
          await markRequestAsReceived(requestId,{
               shipments: shipments.map((s) => ({
              shipped_date: s.shipped_date,
              tracking_link: s.tracking_link,
            })),
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

    const filteredRequests = requests.filter((r) => {
        if (search) {
          const text =
            `${r.request_id} ${r.status} ${r.requestor?.firstname ?? ""}`.toLowerCase();
          if (!text.includes(search.toLowerCase())) return false;
        }
        return true;
      });

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Requests
          </h3>
        </div>

        <div className="flex items-center gap-3">

     <RequestsTab
        value={filter}
        onChange={(val) => {
          setFilter(val);
        }}
      />

         <input
          type="text"
          placeholder="Search requests..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
        />

          {isOperations() && (
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
          )}

        </div>
      </div>

    <RequestsTable requests={filteredRequests} onView={setSelected} />
          {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            disabled={meta.current_page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 dark:text-gray-300"
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
            className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 dark:text-gray-300"
          >
            Next
          </button>
          
        </div>
      )}

      <CreateOrderModal isOpen={isOpen} onClose={closeModal} onSubmit={handleCreateOrder} />

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
