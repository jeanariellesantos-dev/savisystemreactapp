import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useEffect, useState } from "react";

import { Category, CategoryService } from "../../services/categoryService";
import { Product, Unit, ProductService } from "../../services/productService";

type OrderItem = {
  id: string;
  categoryId: number | null;
  productId: number | null;
  unitId: number | null;
  quantity: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (items: OrderItem[]) => void | Promise<void>;
};

export default function CreateOrderModal({
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [items, setItems] = useState<OrderItem[]>([
    {
      id: crypto.randomUUID(),
      categoryId: null,
      productId: null,
      unitId: null,
      quantity: 1,
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<number, Product[]>>({});
  const [units, setUnits] = useState<Record<number, Unit[]>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    CategoryService.getAll().then(setCategories);
  }, []);

  const updateItem = <K extends keyof OrderItem>(
    index: number,
    field: K,
    value: OrderItem[K]
  ) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        categoryId: null,
        productId: null,
        unitId: null,
        quantity: 1,
      },
    ]);

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const loadProducts = async (categoryId: number) => {
    if (products[categoryId]) return;
    const data = await ProductService.getByCategory(categoryId);
    setProducts((prev) => ({ ...prev, [categoryId]: data }));
  };

  const loadUnits = async (productId: number) => {
    if (units[productId]) return;
    const data = await ProductService.getUnits(productId);
    setUnits((prev) => ({ ...prev, [productId]: data }));
  };

  const submitToParent = () => {
    if (
      items.some(
        (i) =>
          !i.categoryId || !i.productId || !i.unitId || i.quantity < 1
      )
    ) {
      alert("Please complete all items");
      return;
    }

    onSubmit?.(items);
    onClose();
  };

  const isFormInvalid = items.some(
  (i) => !i.categoryId || !i.productId || !i.unitId || i.quantity < 1
);


  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[760px]">
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create Order
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Select category, product, unit, and quantity for each item
          </p>
        </div>

        {/* ITEMS */}
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          {items.map((item, index) => {
            const productList = item.categoryId
              ? products[item.categoryId] || []
              : [];

            const unitList = item.productId
              ? units[item.productId] || []
              : [];

            return (
              <div
                key={item.id}
                className="rounded-2xl border bg-gray-50 p-4 shadow-sm dark:bg-gray-800"
              >
                <div className="mb-3 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                  Item {index + 1}
                </div>

                <div className="grid grid-cols-12 gap-3 items-end">
                  {/* CATEGORY */}
                  <div className="col-span-3">
                    <Label>Category</Label>
                    <select
                      value={item.categoryId ?? ""}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : Number(e.target.value);
                        updateItem(index, "categoryId", value);
                        updateItem(index, "productId", null);
                        updateItem(index, "unitId", null);
                        if (value) loadProducts(value);
                      }}
                      className="w-full rounded-md border p-2"
                    >
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PRODUCT */}
                  <div className="col-span-3">
                    <Label>Product</Label>
                    <select
                      value={item.productId ?? ""}
                      disabled={!item.categoryId}
                      onChange={(e) => {
                        const value =
                          e.target.value === "" ? null : Number(e.target.value);
                        updateItem(index, "productId", value);
                        updateItem(index, "unitId", null);
                        if (value) loadUnits(value);
                      }}
                      className="w-full rounded-md border p-2 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    >
                      <option value="">
                        {item.categoryId
                          ? "Select product"
                          : "Select category first"}
                      </option>
                      {productList.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.product_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* UNIT */}
                  <div className="col-span-2">
                    <Label>Unit</Label>
                    <select
                      value={item.unitId ?? ""}
                      disabled={!item.productId}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "unitId",
                          e.target.value === ""
                            ? null
                            : Number(e.target.value)
                        )
                      }
                      className="w-full rounded-md border p-2 disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    >
                      <option value="">
                        {item.productId ? "Select unit" : "Select product first"}
                      </option>
                      {unitList.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* QTY */}
                  <div className="col-span-2">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                    />
                  </div>

                  {/* REMOVE */}
                  <div className="col-span-2 flex justify-end">
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                        title="Remove item"
                      >
                        ✕ Remove Item
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ADD ITEM */}
        <button
          type="button"
          onClick={addItem}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          + Add another item
        </button>

        {/* ACTIONS */}
        <div className="mt-6 flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm"   disabled={isFormInvalid} onClick={() => setShowConfirm(true)}>
            Submit Order
          </Button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <Modal isOpen onClose={() => setShowConfirm(false)} className="max-w-md">
          <div className="p-6">
            <h3 className="text-lg font-semibold">Confirm Submission</h3>
            <p className="mt-2 text-sm text-gray-600">
              Please confirm that you want to submit this order.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setShowConfirm(false);
                  submitToParent();
                }}
              >
                Yes, Submit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
}
