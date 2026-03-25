import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import RoleTable from "../../components/roles/RoleTable";
import RoleModal from "../../components/roles/RoleModal";
import { RoleService } from "../../services/adminService";
import { Role } from "../../types/role";

export default function ManageRoles() {
  const { showToast } = useToast();

  const [roles, setRoles] = useState<Role[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
  });

  const [selected, setSelected] = useState<Role | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* ================= FETCH ================= */

  const load = async () => {
    try {
      setLoading(true);

      const res = await RoleService.getAll({
        page,
        per_page: 10,
        ...filters,
      });

      setRoles(res.data); // ✅ paginated data
      setMeta(res);       // ✅ pagination meta

    } catch {
      showToast("Failed to load roles", "error");
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
        await RoleService.update(selected.id, data);
      else
        await RoleService.create(data);

      showToast("Saved successfully", "success");
      setModalOpen(false);
      setSelected(null);
      load();
    } catch {
      showToast("Save failed", "error");
    }
  };

  /* ================= TOGGLE ================= */

  const handleToggle = async (r: Role) => {
    try {
      await RoleService.toggleStatus(r.id);
      showToast("Role status updated", "success");
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
          Manage Roles
        </h3>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search role..."
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
            + Create Role
          </Button>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="p-6 text-gray-500">Loading roles...</div>
      ) : (
        <RoleTable
          roles={roles} // ✅ NO FILTER
          onEdit={(r) => {
            setSelected(r);
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
        <RoleModal
          isOpen={modalOpen}
          role={selected}
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