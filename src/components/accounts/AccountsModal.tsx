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

export default function AccountModal({
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
          {isCreate ? "Create Account" : "Edit Account"}
        </h3>

        <div className="grid gap-4">

          <input
            value={form.firstname}
            onChange={(e) => setForm({ ...form, firstname: e.target.value })}
            className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            placeholder="First Name"
          />

          <input
            value={form.lastname}
            onChange={(e) => setForm({ ...form, lastname: e.target.value })}
            className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            placeholder="Last Name"
          />

          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg px-3 py-2 dark:bg-gray-800"
            placeholder="Email"
          />

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

          {/* PASSWORD SECTION */}
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

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg"
          >
            {isCreate ? "Create Account" : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
