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

  const createEmptyItem = (): OrderItem => ({
    id: crypto.randomUUID(),
    categoryId: null,
    productId: null,
    unitId: null,
    quantity: 1,
  });

  const [items, setItems] = useState<OrderItem[]>([createEmptyItem()]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

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

  const addItem = () => {
    setItems((prev) => {
      const next = [...prev, createEmptyItem()];
      setSelectedIndex(next.length - 1);
      return next;
    });
  };

  const duplicateItem = () => {
    const selected = items[selectedIndex];
    if (!selected) return;

    const clone = { ...selected, id: crypto.randomUUID() };

    setItems((prev) => {
      const copy = [...prev];
      copy.splice(selectedIndex + 1, 0, clone);
      setSelectedIndex(selectedIndex + 1);
      return copy;
    });
  };

  const removeItem = () => {
    if (items.length === 1) return;

    setItems((prev) => {
      const next = prev.filter((_, i) => i !== selectedIndex);
      setSelectedIndex(Math.max(0, selectedIndex - 1));
      return next;
    });
  };

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
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[1300px]">

      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Create Order</h2>
          <p className="text-xs text-gray-500">
            Click a row to select it before duplicating or removing
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 h-[540px]">

          {/* ITEMS */}
          <div className="col-span-9 overflow-y-auto pr-2 space-y-3">

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
                  onClick={() => setSelectedIndex(index)}
                  className={`rounded-xl border p-4 cursor-pointer transition
                  ${selectedIndex === index
                    ? "border-blue-500 shadow-sm bg-blue-50/30"
                    : "hover:border-gray-300"
                  }`}
                >

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold bg-gray-200 px-2 py-0.5 rounded">
                      Item #{index + 1}
                    </span>

                    {items.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIndex(index);
                          removeItem();
                        }}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="grid grid-cols-12 gap-2 items-end"
                  >

                    <div className="col-span-4">
                      <Label>Category</Label>
                      <Select
                        value={item.categoryId ? String(item.categoryId) : ""}
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

                    <div className="col-span-4">
                      <Label>Product</Label>
                      <Select
                        value={item.productId ? String(item.productId) : ""}
                        disabled={!item.categoryId}
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

                    <div className="col-span-2">
                      <Label>Unit</Label>
                      <Select
                        value={item.unitId ? String(item.unitId) : ""}
                        disabled={!item.productId}
                        options={unitList.map((u) => ({
                          value: String(u.id),
                          label: u.name,
                        }))}
                        onChange={(value) =>
                          updateItem(index, "unitId", value ? Number(value) : null)
                        }
                      />
                    </div>

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

                  </div>
                </div>
              );
            })}
          </div>

{/* CONTROL PANEL */}
<div className="col-span-3 border-l pl-6 flex flex-col justify-between">

  {/* TOP CONTROLS */}
  <div className="space-y-5 sticky top-0 pt-2">

    <div className="space-y-2">
      <div className="text-xs font-semibold text-gray-500">
        Line Controls
      </div>

      <div className="flex flex-col gap-2">
        <Button size="sm" onClick={addItem}>
          + Add Item
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={isFormInvalid}
          onClick={duplicateItem}
        >
          Duplicate Selected
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={items.length === 1}
          onClick={removeItem}
        >
          Remove Selected
        </Button>
      </div>
    </div>

    {/* LIVE SUMMARY */}
    <div className="rounded-xl border p-3 text-xs bg-gray-50 dark:bg-gray-800 space-y-2">
      <div className="flex justify-between">
        <span>Total Lines</span>
        <span className="font-semibold">{items.length}</span>
      </div>

      <div className="flex justify-between">
        <span>Selected</span>
        <span className="font-semibold">
          #{selectedIndex + 1}
        </span>
      </div>
    </div>

  </div>

{/* BOTTOM ACTIONS */}
<div className="pt-5 mt-5 border-t flex flex-col gap-3">
  <Button size="sm" variant="outline" onClick={onClose}>
    Cancel
  </Button>

  <Button
    size="sm"
    disabled={isFormInvalid}
    onClick={() => setShowConfirm(true)}
  >
    Submit Order
  </Button>
</div>

</div>
        </div>
      </div>
{/* CONFIRM MODAL */}
{showConfirm && (
  <Modal
    isOpen
    onClose={() => setShowConfirm(false)}
    className="max-w-2xl w-full max-h-[100vh]"
  >
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

      
  )};