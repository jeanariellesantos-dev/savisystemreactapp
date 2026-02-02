import RequestsTab from "../common/RequestsTab";
import Button from "../ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { useRequests } from "../../hooks/useRequests";
import RequestsTable from "../requests//RequestsTable";
import CreateOrderModal from "../requests/CreateOrderModal";
import ViewOrderModal from "../common/ViewOrderModal";
import { Request } from "../../types/request";
import { useState } from "react";

export default function RecentRequests() {
  const { requests, loading, error } = useRequests();
  const { isOpen, openModal, closeModal } = useModal();
  const [selected, setSelected] = useState<Request | null>(null);

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
                 <button onClick={openModal} 
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            Create Order
          </button>
        </div>
      </div>

      <RequestsTable
        requests={requests}
        onView={setSelected}
      />

      <CreateOrderModal isOpen={isOpen} onClose={closeModal} />

      {selected && (
        <ViewOrderModal
          isOpen={true}
          request={selected}
          onClose={() => setSelected(null)}
          onApprove={() => {}}
          onReject={() => {}}
        />
      )}
    </div>
  );
}
