import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AccountsTable from "../../components/accounts/AccountsTable";
import AccountModal from "../../components/accounts/AccountsModal";
import ConfirmPasswordModal from "../../components/accounts/ConfirmPasswordModal";
import { UserService } from "../../services/adminService";
import { RoleService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";

export default function ManageAccounts() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role_id: "",
    password: "",
    confirmPassword: "",
  });

  /* ================= LOAD USERS ================= */

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAll();
      setUsers(data);
    } catch {
      showToast("Failed to load accounts", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD ROLES ================= */

  const loadRoles = async () => {
    try {
      const data = await RoleService.getAll();
      setRoles(data);
    } catch {
      showToast("Failed to load roles", "error");
    }
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  /* ================= OPEN CREATE ================= */

  const openCreate = () => {
    setForm({
      firstname: "",
      lastname: "",
      email: "",
      role_id: "",
      password: "",
      confirmPassword: "",
    });
    setIsCreateMode(true);
    setEditingUser({}); // trigger modal
  };

  /* ================= OPEN EDIT ================= */

  const openEdit = (user: any) => {
    setForm({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role_id: user.role_id ?? "",
      password: "",
      confirmPassword: "",
    });
    setIsCreateMode(false);
    setEditingUser(user);
  };

  /* ================= SAVE LOGIC ================= */

  const handleSave = () => {
    if (isCreateMode) {
      if (!form.password || form.password !== form.confirmPassword) {
        showToast("Passwords must match", "error");
        return;
      }
      submitCreate();
      return;
    }

    // EDIT MODE
    if (form.password) {
      if (form.password !== form.confirmPassword) {
        showToast("Passwords do not match", "error");
        return;
      }
      setConfirmPasswordModal(true);
      return;
    }

    submitUpdate(false);
  };

  /* ================= CREATE ================= */

  const submitCreate = async () => {
    try {
      await UserService.create({
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        role_id: form.role_id,
        password: form.password,
      });

      showToast("Account created successfully", "success");
      closeModal();
      loadUsers();
    } catch {
      showToast("Failed to create account", "error");
    }
  };

  /* ================= UPDATE ================= */

  const submitUpdate = async (withPassword: boolean) => {
    if (!editingUser) return;

    try {
      const payload: any = {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        role_id: form.role_id,
      };

      if (withPassword) {
        payload.password = form.password;
      }

      await UserService.update(editingUser.id, payload);

      showToast("User updated successfully", "success");
      closeModal();
      loadUsers();
    } catch {
      showToast("Failed to update user", "error");
    }
  };

  /* ================= TOGGLE STATUS ================= */

const handleToggle = async (user: any) => {
  try {
    await UserService.toggleStatus(user.id);

    showToast(
      user.is_active
        ? "Account deactivated successfully"
        : "Account activated successfully",
      "success"
    );

    loadUsers();
  } catch {
    showToast("Failed to update account status", "error");
  }
};


  /* ================= CLOSE MODAL ================= */

  const closeModal = () => {
    setEditingUser(null);
    setIsCreateMode(false);
    setConfirmPasswordModal(false);
  };

  /* ================= SEARCH ================= */

  const filteredUsers = users.filter((u) =>
    `${u.firstname} ${u.lastname} ${u.email} ${u.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-400">
        Loading accounts...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <>
      <PageMeta title="Manage Accounts" description="Admin user management" />
      <PageBreadcrumb pageTitle="Manage Accounts" />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Manage Accounts
          </h3>

          <div className="flex items-center gap-3">
            <input
              placeholder="Search accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
            />

            <Button size="sm" variant="primary" onClick={openCreate}>
              + Create Account
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <AccountsTable
          users={filteredUsers}
          onEdit={openEdit}
          onToggle={handleToggle}
        />

        {/* ACCOUNT MODAL */}
        {editingUser && (
          <AccountModal
            isOpen={true}
            mode={isCreateMode ? "create" : "edit"}
            onClose={closeModal}
            form={form}
            setForm={setForm}
            onSave={handleSave}
            roles={roles}
          />
        )}

        {/* PASSWORD CONFIRMATION */}
        {confirmPasswordModal && (
          <ConfirmPasswordModal
            isOpen={true}
            onCancel={() => setConfirmPasswordModal(false)}
            onConfirm={() => submitUpdate(true)}
          />
        )}
      </div>
    </>
  );
}
