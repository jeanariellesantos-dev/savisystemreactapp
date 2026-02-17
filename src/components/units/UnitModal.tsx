import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { Unit } from "../../types/unit";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  unit: Unit | null;
  onSubmit: (data: Omit<Unit, "id">) => void;
};

export default function UnitModal({
  isOpen,
  onClose,
  unit,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [abbr, setAbbr] = useState("");

  useEffect(() => {
    if (unit) {
      setName(unit.name);
      setAbbr(unit.abbreviation);
    } else {
      setName("");
      setAbbr("");
    }
  }, [unit]);

  const handleSubmit = () => {
    if (!name.trim() || !abbr.trim()) return;

    onSubmit({
      name,
      abbreviation: abbr.toUpperCase(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <h2 className="text-lg font-semibold mb-4">
        {unit ? "Edit Unit" : "Create Unit"}
      </h2>

      {/* NAME */}

      <div>
        <label className="text-sm font-medium block mb-2">
          Unit Name
        </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter unit name (e.g. Gallon)"
            className="w-full rounded-lg border px-3 py-2 mb-3 dark:bg-gray-800"
          />
      </div>

      {/* ABBR */}
      <div>
        <label className="text-sm font-medium block mb-2">
          Unit Abbreviation
        </label>
        <input
          value={abbr}
          onChange={(e) => setAbbr(e.target.value)}
          placeholder="Enter abbreviation (e.g. GAL)"
          className="w-full rounded-lg border px-3 py-2 mb-4 dark:bg-gray-800"
        />
      </div>

      {/* ACTIONS */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>

        <Button variant="primary" size="sm" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </Modal>
  );
}
