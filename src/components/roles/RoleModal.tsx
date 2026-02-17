import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { Role } from "../../types/role";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSubmit: (data: {
    role_name: string;
    role_description: string;
    is_active: boolean;
  }) => void;
};

export default function RoleModal({
  isOpen,
  onClose,
  role,
  onSubmit,
}: Props) {
  const isEdit = !!role;

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (role) {
      setName(role.role_name);
      setDesc(role.role_description);
      setActive(role.is_active);
    } else {
      setName("");
      setDesc("");
      setActive(true);
    }

    setError(null);
  }, [role]);

  /* ================= SUBMIT ================= */

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Role name is required");
      return;
    }

    setError(null);

    onSubmit({
      role_name: name.trim(),
      role_description: desc.trim(),
      is_active: active,
    });
  };

  /* ================= UI ================= */

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">

        {/* HEADER */}
        <h3 className="text-xl font-semibold mb-6">
          {isEdit ? "Edit Role" : "Create Role"}
        </h3>

        <div className="space-y-6">

          {/* ROLE NAME */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Role Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter role name"
              className="
                w-full rounded-lg border px-3 py-2
                dark:bg-gray-800 dark:border-gray-700
              "
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Role Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Enter role description"
              rows={3}
              className="
                w-full rounded-lg border px-3 py-2
                dark:bg-gray-800 dark:border-gray-700
              "
            />
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button size="sm" onClick={handleSubmit}>
            {isEdit ? "Update Role" : "Create Role"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
