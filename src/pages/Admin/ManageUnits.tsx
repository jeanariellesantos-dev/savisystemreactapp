import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import UnitTable from "../../components/units/UnitTable";
import UnitModal from "../../components/units/UnitModal";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { UnitService } from "../../services/unitService";
import { Unit } from "../../types/unit";

export default function ManageUnits() {
  const { showToast } = useToast();

  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Unit | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================= FETCH ================= */

  const loadUnits = async () => {
    try {
      setLoading(true);
      const res = await UnitService.getAll();
      setUnits(res);
    } catch {
      showToast("Failed to load units", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnits();
  }, []);

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

  /* ================= SEARCH ================= */

  const filtered = units.filter((u) =>
    `${u.name} ${u.abbreviation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">
        Loading units...
      </div>
    );

  /* ================= UI ================= */

  return (
    <>
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manage Units
        </h3>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          />

          <Button size="sm" variant="primary" 
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:opacity-90 transition"
            onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}>              
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
              Create Unit
          </Button>
        </div>
      </div>

      <UnitTable
        units={filtered}
        onEdit={(u) => {
          setSelected(u);
          setModalOpen(true);
        }}
        onToggle={handleToggle}
      />

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
    </>
  );
}
