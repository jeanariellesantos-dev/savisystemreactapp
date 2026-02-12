import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import RoleTable from "../../components/roles/RoleTable";
import RoleModal from "../../components/roles/RoleModal";

import { RoleService } from "../../services/roleService";
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

  const handleDelete = async (r: Role) => {
    if (!confirm(`Delete role "${r.role_name}"?`)) return;

    await RoleService.delete(r.id);
    showToast("Deleted", "success");
    load();
  };

  const filtered = roles.filter((r) =>
    `${r.role_name} ${r.role_description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading)
    return <div className="p-6 text-gray-500">Loading roles...</div>;

  return (
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

          <Button size="sm" variant="primary" onClick={() => {
            setSelected(null);
            setModalOpen(true);
          }}>
            Add Role
          </Button>
        </div>
      </div>

      <RoleTable
        roles={filtered}
        onEdit={(r) => {
          setSelected(r);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
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
  );
}
