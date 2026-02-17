import { Modal } from "../ui/modal";

type Props = {
  isOpen: boolean;
  mode: "create" | "edit";
  onClose: () => void;
  form: any;
  setForm: any;
  onSave: () => void;
  roles: any[];
};

export default function UsersModal({
  isOpen,
  mode,
  onClose,
  form,
  setForm,
  onSave,
  roles,
}: Props) {
  const isCreate = mode === "create";

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <div className="p-6 dark:bg-gray-900 rounded-3xl">
        <h3 className="text-lg font-semibold mb-6">
          {isCreate ? "Create User" : "Edit User"}
        </h3>

        <div className="grid gap-4">

          {/* ===== BASIC INFO ===== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={form.firstname}
              onChange={(e) =>
                setForm({ ...form, firstname: e.target.value })
              }
              className="border rounded-lg px-3 py-2 dark:bg-gray-800"
              placeholder="First Name"
            />

            <input
              value={form.lastname}
              onChange={(e) =>
                setForm({ ...form, lastname: e.target.value })
              }
              className="border rounded-lg px-3 py-2 dark:bg-gray-800"
              placeholder="Last Name"
            />
          </div>

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            placeholder="Email"
          />

          <input
            type="tel"
            value={form.mobile || ""}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value })
            }
            className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            placeholder="Mobile Number (e.g. 09XXXXXXXXX)"
          />

          {/* ROLE SELECT */}
          <select
            value={form.role_id}
            onChange={(e) =>
              setForm({ ...form, role_id: e.target.value })
            }
            className="border rounded-lg px-3 py-2 dark:bg-gray-800"
          >
            <option value="">Select Role</option>

            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>

          {/* ===== PASSWORD SECTION ===== */}
          <div className="border-t pt-4 mt-2">
            <p className="text-sm font-medium mb-2">
              {isCreate
                ? "Set Password"
                : "Change Password (Optional)"}
            </p>

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full dark:bg-gray-800"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="border rounded-lg px-3 py-2 w-full mt-3 dark:bg-gray-800"
            />
          </div>
        </div>

        {/* ===== ACTION BUTTONS ===== */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:opacity-90 transition"
          >
            {isCreate ? "Create User" : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
