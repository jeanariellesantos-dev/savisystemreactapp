import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { Dealership } from "../../types/dealership";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  dealership: Dealership | null;
  onSubmit: (data: {
    dealership_name: string;
    location: string;
    // is_active: boolean;
  }) => void;
};

export default function DealershipModal({
  isOpen,
  onClose,
  dealership,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  // const [active, setActive] = useState(true);

  useEffect(() => {
    if (dealership) {
      setName(dealership.dealership_name);
      setLocation(dealership.location);
      // setActive(dealership.is_active);
    } else {
      setName("");
      setLocation("");
      // setActive(true);
    }
  }, [dealership]);

  const submit = () => {
    if (!name.trim() || !location.trim()) return;

    onSubmit({
      dealership_name: name,
      location,
      // is_active: active,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <h2 className="text-lg font-semibold mb-4">
        {dealership ? "Edit Dealership" : "Create Dealership"}
      </h2>


      <div>
        <label className="text-sm font-medium block mb-2">
          Dealership Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter dealership name"
          className="w-full border rounded-lg px-3 py-2 mb-3 dark:bg-gray-800"
        />
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">
          Location
        </label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="w-full border rounded-lg px-3 py-2 mb-3 dark:bg-gray-800"
        />
      </div>

      {/* <label className="flex items-center gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => setActive(e.target.checked)}
        />
        Active
      </label> */}

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
