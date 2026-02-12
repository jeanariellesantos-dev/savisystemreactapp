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

  /* ================= DELETE ================= */

  const handleDelete = async (unit: Unit) => {
    if (!confirm(`Delete unit "${unit.name}"?`)) return;

    try {
      await UnitService.delete(unit.id);
      showToast("Unit deleted", "success");
      loadUnits();
    } catch {
      showToast("Delete failed", "error");
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
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
          />

          <Button size="sm" variant="primary" onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}>
            Add Unit
          </Button>
        </div>
      </div>

      <UnitTable
        units={filtered}
        onEdit={(u) => {
          setSelected(u);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
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
  );
}
