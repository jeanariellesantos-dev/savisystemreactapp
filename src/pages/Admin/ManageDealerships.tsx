import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import DealershipTable from "../../components/dealerships/DealershipTable";
import DealershipModal from "../../components/dealerships/DealershipModal";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { DealershipService } from "../../services/adminService";
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

  const handleToggle = async (d: Dealership) => {
    try {
      await DealershipService.toggleStatus(d.id);
      showToast("Dealership status updated", "success");
      load();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const filtered = dealerships.filter((d) =>
    `${d.dealership_name} ${d.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading)
    return <div className="p-6 text-gray-500">Loading dealerships...</div>;

  return (
    <>
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
            Create Dealership
          </Button>
        </div>
      </div>

      <DealershipTable
        dealerships={filtered}
        onEdit={(d) => {
          setSelected(d);
          setModalOpen(true);
        }}
        onToggle={handleToggle}
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
    </>
  );
}
