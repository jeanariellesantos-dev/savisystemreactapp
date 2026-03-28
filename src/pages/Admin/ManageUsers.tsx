import { useEffect, useState } from "react";
import UsersTable from "../../components/users/UsersTable";
import UsersModal from "../../components/users/UsersModal";
import ConfirmPasswordModal from "../../components/users/ConfirmPasswordModal";
import { UserService, RoleService, DealershipService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import { User } from "../../types/user";
import { Modal } from "../../components/ui/modal";


export default function ManageUsers() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [dealerships, setDealerships] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
  });

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [originalForm, setOriginalForm] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [form, setForm] = useState({
    employee_number: "",
    firstname: "",
    lastname: "",
    email: "",
    role_id: "",
    dealership_id: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  /* ================= LOAD USERS ================= */

  const loadUsers = async () => {
    try {
      setLoading(true);

      const res = await UserService.getAll({
        page,
        per_page: 10,
        search: debouncedSearch,
        ...filters,
      });

      setUsers(res.data); // ✅ paginated
      setMeta(res);

    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ROLES ================= */

  const loadRoles = async () => {
    try {
      const res = await RoleService.getAll();
      setRoles(res.data);
    } catch {
      showToast("Failed to load roles", "error");
    }
  };

  /* ================= LOAD DEALERSHIPS ================= */

  const loadDealerships = async () => {
    try {
      const res = await DealershipService.getAll();
      setDealerships(res.data);
    } catch {
      showToast("Failed to load dealerships", "error");
    }
  };

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(filters.search);
    setPage(1); // reset page when searching
  }, 500);

  return () => clearTimeout(timer);
}, [filters.search]);

  useEffect(() => {
    loadUsers();
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadRoles();
    loadDealerships();
  }, []);

  /* ================= OPEN CREATE ================= */

  const openCreate = () => {
    setForm({
      employee_number: "",
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      role_id: "",
      dealership_id: "",
      password: "",
      confirmPassword: "",
    });

    setIsCreateMode(true);
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  /* ================= OPEN EDIT ================= */

  const openEdit = (user: any) => {
    const data = {
      employee_number: user.employee_number ?? "",
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      email: user.email ?? "",
      mobile: user.mobile ?? "",
      dealership_id: user.dealership_id ?? "",
      role_id: user.role_id ?? "",
    };

    setForm({ ...data, password: "", confirmPassword: "" });
    setOriginalForm(data);

    setIsCreateMode(false);
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    if (isCreateMode) {
      if (!form.password || form.password !== form.confirmPassword) {
        showToast("Passwords must match", "error");
        return;
      }
      submitCreate();
      return;
    }

    if (form.password) {
      if (form.password !== form.confirmPassword) {
        showToast("Passwords do not match", "error");
        return;
      }
      setConfirmPasswordModal(true);
      return;
    }

    submitUpdate();
  };

  const submitCreate = async () => {
    try {
      await UserService.create({ ...form });
      showToast("Account created successfully", "success");
      closeModal();
      loadUsers();
    } catch {
      showToast("Failed to create user", "error");
    }
  };

  const submitUpdate = async () => {
    if (!editingUser) return;

    try {
      await UserService.update(editingUser.id, { ...form });
      showToast("User updated successfully", "success");
      closeModal();
      loadUsers();
    } catch {
      showToast("Update failed", "error");
    }
  };

  /* ================= TOGGLE ================= */

  const handleToggle = async (user: any) => {
    try {
      await UserService.toggleStatus(user.id);
      showToast("User status updated", "success");
      loadUsers();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";

      showToast(message, "error");
    }
  };

/* ================= DELETE ================= */
  const handleDelete = (user: User) => {
  setSelectedUser(user);
  setShowDeleteModal(true);
};

const confirmDelete = async () => {
  if (!selectedUser) return;

  try {
    await UserService.delete(selectedUser.id);

    // refresh list
    loadUsers();

    setShowDeleteModal(false);
    setSelectedUser(null);
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong";

    showToast(message, "error");
  }
};

  /* ================= CLOSE ================= */
  const closeModal = () => {
    setEditingUser(null);
    setIsCreateMode(false);
    setConfirmPasswordModal(false);
    setIsUserModalOpen(false);
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="p-6 text-gray-500">Loading users...</div>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Manage Users
        </h3>

        <div className="flex items-center gap-3">
          <input
            placeholder="Search user..."
            value={filters.search}
            onChange={(e) => {
              setPage(1);
              setFilters({ search: e.target.value });
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <Button size="sm" onClick={openCreate}>
            + Create User
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <UsersTable
        users={users} 
        onEdit={openEdit}
        onToggle={handleToggle}
        onDelete={handleDelete} 
      />

      {/* PAGINATION */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-between mt-4">
          <button
            disabled={meta.current_page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {meta.current_page} of {meta.last_page}
          </span>

          <button
            disabled={meta.current_page === meta.last_page}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      

      {/* MODALS */}
      {isUserModalOpen && (
        <UsersModal
          isOpen={true}
          mode={isCreateMode ? "create" : "edit"}
          onClose={closeModal}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          roles={roles}
          dealerships={dealerships}
          hasChanges={true}
        />
      )}

      {confirmPasswordModal && (
        <ConfirmPasswordModal
          isOpen={true}
          onCancel={() => setConfirmPasswordModal(false)}
          onConfirm={submitUpdate}
        />
      )}

      {showDeleteModal && selectedUser && (
        <Modal
          isOpen
          onClose={() => setShowDeleteModal(false)}
          className="max-w-md"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete User
            </h3>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Are you sure you want to delete{" "}
              <span className="font-semibold">
                {selectedUser.firstname} {selectedUser.lastname}
              </span>
              ?
            </p>

            <p className="mt-1 text-xs text-red-500">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm rounded-lg border dark:border-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}