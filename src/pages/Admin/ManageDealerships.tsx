import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import DealershipTable from "../../components/dealerships/DealershipTable";
import DealershipModal from "../../components/dealerships/DealershipModal";
import { DealershipService } from "../../services/adminService";
import { Dealership } from "../../types/dealership";

export default function ManageDealerships() {
  const { showToast } = useToast();

  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
  });

  const [selected, setSelected] = useState<Dealership | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================= FETCH ================= */

  const load = async () => {
    try {
      setLoading(true);

      const res = await DealershipService.getAll({
        page,
        per_page: 10,
        ...filters,
      });

      setDealerships(res.data); // ✅ paginated data
      setMeta(res);             // ✅ pagination meta

    } catch {
      showToast("Failed to load dealerships", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, filters]);

  /* ================= SAVE ================= */

  const handleSave = async (data: any) => {
    try {
      if (selected)
        await DealershipService.update(selected.id, data);
      else
        await DealershipService.create(data);

      showToast("Saved successfully", "success");
      setModalOpen(false);
      setSelected(null);
      load();
    } catch {
      showToast("Save failed", "error");
    }
  };

  /* ================= TOGGLE ================= */

  const handleToggle = async (d: Dealership) => {
    try {
      await DealershipService.toggleStatus(d.id);
      showToast("Dealership status updated", "success");
      load();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manage Dealerships
        </h3>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search dealership..."
            value={filters.search}
            onChange={(e) => {
              setPage(1); // ✅ reset page
              setFilters({ search: e.target.value });
            }}
            className="rounded-lg border px-3 py-2 text-sm dark:bg-gray-800 dark:text-gray-400"
          />

          <Button
            size="sm"
            variant="primary"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:opacity-90 transition"
            onClick={() => {
              setSelected(null);
              setModalOpen(true);
            }}
          >
            + Create Dealership
          </Button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="p-6 text-gray-500">Loading dealerships...</div>
      ) : (
        <DealershipTable
          dealerships={dealerships} // ✅ NO FILTER
          onEdit={(d) => {
            setSelected(d);
            setModalOpen(true);
          }}
          onToggle={handleToggle}
        />
      )}

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
            Page <b>{meta.current_page}</b> of <b>{meta.last_page}</b>
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
      {modalOpen && (
        <DealershipModal
          isOpen={modalOpen}
          dealership={selected}
          onClose={() => {
            setModalOpen(false);
            setSelected(null);
          }}
          onSubmit={handleSave}
        />
      )}

    </div>
  );
}