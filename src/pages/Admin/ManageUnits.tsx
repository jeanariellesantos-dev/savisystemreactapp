import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import UnitTable from "../../components/units/UnitTable";
import UnitModal from "../../components/units/UnitModal";
import { UnitService } from "../../services/unitService";
import { Unit } from "../../types/unit";

export default function ManageUnits() {
  const { showToast } = useToast();

  const [units, setUnits] = useState<Unit[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
  });

  const [selected, setSelected] = useState<Unit | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================= FETCH ================= */

  const loadUnits = async () => {
    try {
      setLoading(true);

      const res = await UnitService.getAll({
        page,
        per_page: 10,
        ...filters,
      });

      setUnits(res.data); // ✅ paginated data
      setMeta(res);       // ✅ pagination meta

    } catch {
      showToast("Failed to load units", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, [page, filters]);

  /* ================= SAVE ================= */

  const handleSave = async (data: Omit<Unit, "id">) => {
    try {
      if (selected) {
        await UnitService.update(selected.id, data);
        showToast("Unit updated", "success");
      } else {
        await UnitService.create(data);
        showToast("Unit created", "success");
      }

      setModalOpen(false);
      setSelected(null);
      loadUnits();
    } catch {
      showToast("Failed to save unit", "error");
    }
  };

  /* ================= TOGGLE ================= */

  const handleToggle = async (unit: Unit) => {
    try {
      await UnitService.toggleStatus(unit.id);
      showToast("Unit status updated", "success");
      loadUnits();
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
          Manage Units
        </h3>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search unit..."
            value={filters.search}
            onChange={(e) => {
              setPage(1); // ✅ reset page
              setFilters({ search: e.target.value });
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
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
            + Create Unit
          </Button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="p-6 text-gray-500 dark:text-gray-400">
          Loading units...
        </div>
      ) : (
        <UnitTable
          units={units} // ✅ NO FILTER
          onEdit={(u) => {
            setSelected(u);
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
        <UnitModal
          isOpen={modalOpen}
          unit={selected}
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