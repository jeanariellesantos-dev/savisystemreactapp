import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useEffect, useState } from "react";

import { Category } from "../../types/category";
import { CategoryService } from "../../services/categoryService";
import Select from "../form/Select";
import { Product, Unit, ProductService } from "../../services/productService";
import { OrderItem } from "../../types/orderItem";

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

const orderSummary = items.map((item) => {
  const category = categories.find((c) => c.id === item.categoryId);

  const product =
    item.categoryId && products[item.categoryId]
      ? products[item.categoryId].find((p) => p.id === item.productId)
      : null;

  const unit =
    item.productId && units[item.productId]
      ? units[item.productId].find((u) => u.id === item.unitId)
      : null;

  return {
    category: category?.name ?? "-",
    product: product?.product_name ?? "-",
    unit: unit?.name ?? "-",
    quantity: item.quantity,
  };
});



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
                  <div className="col-span-4">
                    <Label>Category</Label>
                    <Select
                      value={item.categoryId ? String(item.categoryId) : ""}
                      placeholder="Select category"
                      options={categories.map((c) => ({
                        value: String(c.id),
                        label: c.name,
                      }))}
                      onChange={(value) => {
                        const numericValue = value ? Number(value) : null;

                        updateItem(index, "categoryId", numericValue);
                        updateItem(index, "productId", null);
                        updateItem(index, "unitId", null);

                        if (numericValue) loadProducts(numericValue);
                      }}
                    />

                  </div>

                  {/* PRODUCT */}
                  <div className="col-span-4">
                    <Label>Product</Label>
                  <Select
                    value={item.productId ? String(item.productId) : ""}
                    disabled={!item.categoryId}
                    placeholder={
                      item.categoryId
                        ? "Select product"
                        : "Select category first"
                    }
                    options={productList.map((p) => ({
                      value: String(p.id),
                      label: p.product_name,
                    }))}
                    onChange={(value) => {
                      const numericValue = value ? Number(value) : null;

                      updateItem(index, "productId", numericValue);
                      updateItem(index, "unitId", null);

                      if (numericValue) loadUnits(numericValue);
                    }}
                  />

                  </div>

                  {/* UNIT */}
                  <div className="col-span-2">
                    <Label>Unit</Label>
                    <Select
                      value={item.unitId ? String(item.unitId) : ""}
                      disabled={!item.productId}
                      placeholder={
                        item.productId
                          ? "Select unit"
                          : "Select product first"
                      }
                      options={unitList.map((u) => ({
                        value: String(u.id),
                        label: u.name,
                      }))}
                      onChange={(value) =>
                        updateItem(
                          index,
                          "unitId",
                          value ? Number(value) : null
                        )
                      }
                    />

                  </div>

                  {/* QTY */}
                  <div className="col-span-2">
                    <Label>Qty</Label>
                    <Input
                      type="number"
                      min={"1"}
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
  <Modal isOpen onClose={() => setShowConfirm(false)} className="max-w-2xl w-full max-h-[100vh]">
    <div className="p-6 flex flex-col h-full max-h-[100vh]">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Confirm Order Submission
      </h3>

      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Please review the order summary before submitting.
      </p>

      {/* SUMMARY */}
      <div className="mt-4 max-h-[400px] overflow-y-auto rounded-xl border bg-gray-50 dark:bg-gray-800">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            <tr>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Unit</th>
              <th className="p-2 text-right">Qty</th>
            </tr>
          </thead>

          <tbody>
            {orderSummary.map((item, i) => (
              <tr
                key={i}
                className="border-b last:border-0 text-gray-700 dark:text-gray-200"
              >
                <td className="p-2">{item.category}</td>
                <td className="p-2">{item.product}</td>
                <td className="p-2">{item.unit}</td>
                <td className="p-2 text-right font-medium">
                  {item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL */}
      <div className="mt-3 flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Total Line Items:</span>
        <span className="font-semibold">{items.length}</span>
      </div>

      {/* ACTIONS */}
      <div className="mt-6 flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfirm(false)}
        >
          Back
        </Button>

        <Button
          size="sm"
          onClick={() => {
            setShowConfirm(false);
            submitToParent();
          }}
        >
          Confirm & Submit
        </Button>
      </div>
    </div>
  </Modal>
)}

    </Modal>
  );
}
