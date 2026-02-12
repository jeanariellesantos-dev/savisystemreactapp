import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import DealershipTable from "../../components/dealerships/DealershipTable";
import DealershipModal from "../../components/dealerships/DealershipModal";

import { DealershipService } from "../../services/dealershipService";
import { Dealership } from "../../types/dealership";

export default function ManageDealerships() {
  const { showToast } = useToast();

  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Dealership | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setDealerships(await DealershipService.getAll());
    } catch {
      showToast("Failed to load dealerships", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

  const handleDelete = async (d: Dealership) => {
    if (!confirm(`Delete "${d.dealership_name}"?`)) return;

    await DealershipService.delete(d.id);
    showToast("Deleted", "success");
    load();
  };

  const filtered = dealerships.filter((d) =>
    `${d.dealership_name} ${d.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading)
    return <div className="p-6 text-gray-500">Loading dealerships...</div>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manage Dealerships
        </h3>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search dealership..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm dark:bg-gray-800"
          />

          <Button size="sm" variant="primary" onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}>
            Add Dealership
          </Button>
        </div>
      </div>

      <DealershipTable
        dealerships={filtered}
        onEdit={(d) => {
          setSelected(d);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

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
