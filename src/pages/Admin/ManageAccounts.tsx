import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import AccountsTable from "../../components/accounts/AccountsTable";
import AccountModal from "../../components/accounts/AccountsModal";
import ConfirmPasswordModal from "../../components/accounts/ConfirmPasswordModal";
import { getUsers, updateUser, toggleUserStatus } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

export default function ManageAccounts() {
  const { showToast } = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const loadUsers = async () => {
    const { data } = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEdit = (user: any) => {
    setForm({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      password: "",
      confirmPassword: "",
    });
    setEditingUser(user);
  };

  const handleSave = () => {
    if (!editingUser) return;

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

  const submitUpdate = async (withPassword: boolean) => {
    if (!editingUser) return;

    try {
      const payload: any = {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        role: form.role,
      };

      if (withPassword) {
        payload.password = form.password;
      }

      await updateUser(editingUser.id, payload);

      showToast("User updated successfully", "success");
      setEditingUser(null);
      setConfirmPasswordModal(false);
      loadUsers();
    } catch {
      showToast("Failed to update user", "error");
    }
  };

  const handleToggle = async (user: any) => {
    await toggleUserStatus(user.id);
    showToast("Account status updated", "success");
    loadUsers();
  };

  return (
    <>
      <PageMeta title="Manage Accounts" description="Admin user management" />
      <PageBreadcrumb pageTitle="Manage Accounts" />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

        <AccountsTable
          users={users}
          onEdit={openEdit}
          onToggle={handleToggle}
        />

        {editingUser && (
          <AccountModal
            isOpen={true}
            onClose={() => setEditingUser(null)}
            form={form}
            setForm={setForm}
            onSave={handleSave}
          />
        )}

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
