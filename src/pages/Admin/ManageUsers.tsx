import { useEffect, useState } from "react";
import UsersTable from "../../components/users/UsersTable";
import UsersModal from "../../components/users/UsersModal";
import ConfirmPasswordModal from "../../components/users/ConfirmPasswordModal";
import { UserService } from "../../services/adminService";
import { RoleService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";

export default function ManageUsers() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [originalForm, setOriginalForm] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role_id: "",
    mobile: "",
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
      showToast("Failed to load users", "error");
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
      mobile: "",
      role_id: "",
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
        firstname: user.firstname ?? "",
        lastname: user.lastname ?? "",
        email: user.email ?? "",
        mobile: user.mobile ?? "",
        role_id: user.role_id ?? "",
      };

      setForm({
        ...data,
        password: "",
        confirmPassword: "",
      });

      setOriginalForm(data);
      setIsCreateMode(false);
      setEditingUser(user);
      setIsUserModalOpen(true); 
    };


      /* ================= OPEN CHANGES ================= */
    const hasUserInfoChanged = () => {

      if (!originalForm) return false;

      const infoChanged =
        form.firstname !== originalForm.firstname ||
        form.lastname !== originalForm.lastname ||
        form.email !== originalForm.email ||
        form.mobile !== originalForm.mobile ||
        String(form.role_id) !== String(originalForm.role_id);

      const passwordFilled =
        form.password.trim() !== "" ||
        form.confirmPassword.trim() !== "";

      return infoChanged || passwordFilled;
    };


    const hasChanges = isCreateMode ? true : hasUserInfoChanged();



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

    submitUpdate();
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
      showToast("Failed to create user", "error");
    }
  };

  /* ================= UPDATE ================= */

  const submitUpdate = async () => {

  if (!editingUser) return;

      const infoChanged =
        form.firstname !== originalForm.firstname ||
        form.lastname !== originalForm.lastname ||
        form.email !== originalForm.email ||
        form.mobile !== originalForm.mobile ||
        String(form.role_id) !== String(originalForm.role_id);

      const passwordFilled =
        form.password.trim() !== "";

      if (!infoChanged && !passwordFilled) {
        showToast("No changes detected", "error");
        return;
      }

    try {

      await UserService.update(editingUser.id, {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        role_id: form.role_id,
        mobile: form.mobile,
      });

      showToast("User info updated successfully", "success");

      closeModal();
      loadUsers();

    } catch (err: any) {

      // BACKEND VALIDATION ERROR
      if (err.response?.data?.message) {
        showToast(err.response.data.message, "error");
      } else {
        showToast("Update failed", "error");
      }

    }
  };


  /* ================= TOGGLE STATUS ================= */

const handleToggle = async (user: any) => {
  try {
    await UserService.toggleStatus(user.id);

    showToast(
      user.is_active
        ? "User deactivated successfully"
        : "User activated successfully",
      "success"
    );

    loadUsers();
  } catch {
    showToast("Failed to update user status", "error");
  }
};


  /* ================= CLOSE MODAL ================= */

    const closeModal = () => {
      setEditingUser(null);
      setIsCreateMode(false);
      setConfirmPasswordModal(false);
      setIsUserModalOpen(false);  
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
        Loading users...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Manage Users
          </h3>

          <div className="flex items-center gap-3">
            <input
              placeholder="Search user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
            />

            <Button 
              size="sm" 
              variant="primary" 
              className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:opacity-90 transition"
              onClick={openCreate}>
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
              Create User
            </Button>
          </div>
        </div>

        {/* TABLE */}
        <UsersTable
          users={filteredUsers}
          onEdit={openEdit}
          onToggle={handleToggle}
        />

        {/* ACCOUNT MODAL */}
        {isUserModalOpen && (
          <UsersModal
            isOpen={true}
            mode={isCreateMode ? "create" : "edit"}
            onClose={closeModal}
            form={form}
            setForm={setForm}
            onSave={handleSave}
            roles={roles}
            hasChanges={hasChanges}
          />
        )}

        {/* PASSWORD CONFIRMATION */}
        {confirmPasswordModal && (
          <ConfirmPasswordModal
            isOpen={true}
            onCancel={() => setConfirmPasswordModal(false)}
            onConfirm={() => submitUpdate()}
          />
        )}
      </div>
    </>
  );
}
