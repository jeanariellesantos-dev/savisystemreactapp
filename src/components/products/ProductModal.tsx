import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { Product } from "../../types/product";
import { Category } from "../../types/category";
import { Unit } from "../../types/unit";
import { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  product: Product | null;
  categories: Category[];
  units: Unit[];
};

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  categories,
  units,
}: Props) {
  const [form, setForm] = useState({
    product_name: "",
    category_id: "",
    unit_ids: [] as number[],
  });

  useEffect(() => {
    if (product) {
      setForm({
        product_name: product.product_name,
        category_id: String(product.category?.id ?? ""),
        unit_ids: product.units?.map((u) => u.id) ?? [],
      });
    } else {
      setForm({
        product_name: "",
        category_id: "",
        unit_ids: [],
      });
    }
  }, [product]);

  const toggleUnit = (id: number) => {
    setForm((prev) => ({
      ...prev,
      unit_ids: prev.unit_ids.includes(id)
        ? prev.unit_ids.filter((u) => u !== id)
        : [...prev.unit_ids, id],
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px]">
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">

        <h3 className="text-xl font-semibold mb-6">
          {product ? "Edit Product" : "Add Product"}
        </h3>

        <div className="space-y-5">

          {/* PRODUCT NAME */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Product Name
            </label>
            <input
              value={form.product_name}
              onChange={(e) =>
                setForm({ ...form, product_name: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
              placeholder="Enter product name"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Category
            </label>
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({ ...form, category_id: e.target.value })
              }
              className="w-full rounded-lg border px-3 py-2 dark:bg-gray-800"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* UNITS (Checkbox grid) */}
          <div>
            <label className="text-sm font-medium block mb-3">
              Units
            </label>

            <div className="grid grid-cols-2 gap-3">
              {units.map((u) => (
                <label
                  key={u.id}
                  className="
                    flex items-center gap-2
                    rounded-lg border px-3 py-2
                    hover:bg-gray-50 dark:hover:bg-gray-800
                    cursor-pointer
                  "
                >
                  <input
                    type="checkbox"
                    checked={form.unit_ids.includes(u.id)}
                    onChange={() => toggleUnit(u.id)}
                  />
                  <span className="text-sm">{u.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={() =>
              onSubmit({
                product_name: form.product_name,
                category_id: Number(form.category_id),
                unit_ids: form.unit_ids,
              })
            }
          >
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
