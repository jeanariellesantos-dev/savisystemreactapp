import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { Category } from "../../types/category";
import { generateSlug } from "./../utils/slug";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  onSubmit: (data: {
    name: string;
    slug: string;
    // is_active: boolean;
  }) => void;
};

export default function CategoryModal({
  isOpen,
  onClose,
  category,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  // const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setSlug(category.slug);
      // setIsActive(category.is_active);
    } else {
      setName("");
      setSlug("");
      // setIsActive(true);
    }
        setError(null);
  }, [category]);

  /* ===== HANDLERS ===== */

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = () => {
    if (!name.trim())  {
      setError("Category name is required");
       return;
    }

    onSubmit({
      name,
      slug,
      // is_active: isActive,
    });
  };

  /* ===== UI ===== */

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md p-6">
      <h2 className="text-lg font-semibold mb-4">
        {category ? "Edit Category" : "Create Category"}
      </h2>

      {/* NAME */}
      <div>
        <label className="text-sm font-medium block mb-2">
          Category Name
        </label>

          <input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter category name"
            className="w-full rounded-lg border px-3 py-2 mb-3 dark:bg-gray-800"
          />
      </div>


      {/* SLUG */}
       <div>
        <label className="text-sm font-medium block mb-2">
          Slug
        </label>
      <input
        value={slug}
        readOnly
        onChange={(e) => setSlug(generateSlug(e.target.value))}
        placeholder="Slug"
        className="
                w-full rounded-lg border px-3 py-2 mb-3
                bg-gray-100 text-gray-500 cursor-not-allowed
                dark:bg-gray-800 dark:text-gray-400
            "
      />

          </div>

                    {/* ERROR MESSAGE */}
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

      {/* ACTIVE TOGGLE
      <label className="flex items-center gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Active
      </label> */}

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
