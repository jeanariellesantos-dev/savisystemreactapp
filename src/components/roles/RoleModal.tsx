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
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [active, setActive] = useState(true);

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
  }, [role]);

  const submit = () => {
    if (!name.trim()) return;

    onSubmit({
      role_name: name,
      role_description: desc,
      is_active: active,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <h2 className="text-lg font-semibold mb-4">
        {role ? "Edit Role" : "Create Role"}
      </h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Role name"
        className="w-full border rounded-lg px-3 py-2 mb-3 dark:bg-gray-800"
      />

      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Role description"
        className="w-full border rounded-lg px-3 py-2 mb-3 dark:bg-gray-800"
      />

      <label className="flex items-center gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Active
      </label>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>

        <Button size="sm" onClick={submit}>
          Save
        </Button>
      </div>
    </Modal>
  );
}
