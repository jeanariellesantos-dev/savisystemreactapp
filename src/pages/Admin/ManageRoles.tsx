import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import RoleTable from "../../components/roles/RoleTable";
import RoleModal from "../../components/roles/RoleModal";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { RoleService } from "../../services/adminService";
import { Role } from "../../types/role";

export default function ManageRoles() {
  const { showToast } = useToast();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Role | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setRoles(await RoleService.getAll());
    } catch {
      showToast("Failed to load roles", "error");
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

  const handleToggle = async (r: Role) => {
    try {
      await RoleService.toggleStatus(r.id);
      showToast("Product status updated", "success");
      load();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const filtered = roles.filter((r) =>
    `${r.role_name} ${r.role_description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading)
    return <div className="p-6 text-gray-500">Loading roles...</div>;

  return (
    <>

    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manage Roles
        </h3>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search role..."
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
              Create Role
          </Button>
        </div>
      </div>

      <RoleTable
        roles={filtered}
        onEdit={(r) => {
          setSelected(r);
          setModalOpen(true);
        }}
        onToggle={handleToggle}
      />

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
        </>
  );
}
