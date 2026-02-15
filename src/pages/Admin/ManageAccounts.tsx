import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Modal } from "../../components/ui/modal";
import { getUsers, updateUser, toggleUserStatus } from "../../services/userService";
import { useToast } from "../../context/ToastContext";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  is_active: boolean;
};

export default function ManageAccounts() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [confirmPasswordModal, setConfirmPasswordModal] = useState(false);
  const [pendingPassword, setPendingPassword] = useState(false);

  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const { showToast } = useToast();

  const loadUsers = async () => {
    const { data } = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEditModal = (user: User) => {
    setEditForm({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      password: "",
      confirmPassword: "",
    });
    setEditingUser(user);
  };

  const handleSaveClick = () => {
    if (editForm.password) {
      if (editForm.password !== editForm.confirmPassword) {
        showToast("Passwords do not match", "error");
        return;
      }
      setPendingPassword(true);
      setConfirmPasswordModal(true);
    } else {
      handleUpdateUser();
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const payload: any = {
        firstname: editForm.firstname,
        lastname: editForm.lastname,
        email: editForm.email,
        role: editForm.role,
      };

      if (pendingPassword && editForm.password) {
        payload.password = editForm.password;
      }

      await updateUser(editingUser.id, payload);

      showToast("User updated successfully", "success");
      setEditingUser(null);
      setConfirmPasswordModal(false);
      setPendingPassword(false);
      loadUsers();
    } catch (err) {
      showToast("Failed to update user", "error");
    }
  };

  const handleToggleStatus = async (user: User) => {
    await toggleUserStatus(user.id);
    loadUsers();
    showToast("Account status updated", "success");
  };

  return (
    <>
      <PageMeta title="Manage Accounts" description="Admin user management" />
      <PageBreadcrumb pageTitle="Manage Accounts" />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-right py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b dark:border-gray-800">
                  <td className="py-3 px-4">
                    {user.firstname} {user.lastname}
                  </td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.role}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">

                      {/* EDIT */}
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Edit"
                      >
                        ✏
                      </button>

                      {/* TOGGLE */}
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                        title={user.is_active ? "Deactivate" : "Activate"}
                      >
                        {user.is_active ? "❌" : "✔"}
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EDIT MODAL */}
        {editingUser && (
          <Modal isOpen={true} onClose={() => setEditingUser(null)} className="max-w-[600px]">
            <div className="p-6 dark:bg-gray-900 rounded-3xl">
              <h3 className="text-lg font-semibold mb-6">Edit User</h3>

              <div className="grid gap-4">
                <input
                  value={editForm.firstname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, firstname: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 dark:bg-gray-800"
                  placeholder="First Name"
                />

                <input
                  value={editForm.lastname}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lastname: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 dark:bg-gray-800"
                  placeholder="Last Name"
                />

                <input
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 dark:bg-gray-800"
                  placeholder="Email"
                />

                <select
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="border rounded-lg px-3 py-2 dark:bg-gray-800"
                >
                  <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                  <option value="OPERATION">OPERATION</option>
                  <option value="ACCOUNTING">ACCOUNTING</option>
                  <option value="SUPERVISOR">SUPERVISOR</option>
                  <option value="INVENTORY">INVENTORY</option>
                </select>

                {/* PASSWORD SECTION */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">
                    Change Password (Optional)
                  </p>

                  <input
                    type="password"
                    placeholder="New Password"
                    value={editForm.password}
                    onChange={(e) =>
                      setEditForm({ ...editForm, password: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full dark:bg-gray-800"
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={editForm.confirmPassword}
                    onChange={(e) =>
                      setEditForm({ ...editForm, confirmPassword: e.target.value })
                    }
                    className="border rounded-lg px-3 py-2 w-full mt-3 dark:bg-gray-800"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClick}
                  className="px-4 py-2 bg-brand-500 text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* CONFIRM PASSWORD CHANGE MODAL */}
        {confirmPasswordModal && (
          <Modal isOpen={true} onClose={() => setConfirmPasswordModal(false)} className="max-w-md">
            <div className="p-6 dark:bg-gray-900 rounded-3xl">
              <h3 className="text-lg font-semibold mb-4">
                Confirm Password Change
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You are about to change this user's password.
                This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setConfirmPasswordModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </>
  );
}
