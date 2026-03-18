import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useEffect, useState } from "react";
import { getRoleFlags, getUserRole } from "../../components/utils/authHelper";
import { Category } from "../../types/category";
import { CategoryService } from "../../services/categoryService";
import Select from "../form/Select";
import { Product, Unit, ProductService } from "../../services/productService";
import { UserService } from "../../services/userService";
import { OrderItem } from "../../types/orderItem";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (payload: {
    requestor_id: number;
    items: OrderItem[];
  }) => void | Promise<void>;
  initialItems?: OrderItem[];   // NEW
  title?: string;               // NEW
};

export default function CreateOrderModal({
  isOpen,
  onClose,
  onSubmit,
  initialItems,
  title,
}: Props) {

const createEmptyItem = (): OrderItem => ({
  id: crypto.randomUUID(),
  categoryId: null,
  categoryName: "",
  productId: null,
  productName: "",
  unitId: null,
  unitName: "",
  quantity: 1,
});

  const { isAccounting, isOperations } = getRoleFlags();
  //load operation users

  const [operationUsers, setOperationUsers] = useState<any[]>([]);
  const [userRole, setUserRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [requestorId, setRequestorId] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userid") || "";

    setUserRole(getUserRole);
    setCurrentUserId(userId);

    if (isOperations) {
      setRequestorId(userId);
    }
  }, []);

  useEffect(() => {
  const loadOperationUsers = async () => {
    const users = await UserService.getByRole("OPERATION");
    setOperationUsers(users);
  };

  loadOperationUsers();
}, []);

  const [items, setItems] = useState<OrderItem[]>([createEmptyItem()]);

  useEffect(() => {
    if (initialItems?.length) {
      setItems(initialItems);
    } else {
      setItems([createEmptyItem()]);
    }
  }, [initialItems]);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<number, Product[]>>({});
  const [units, setUnits] = useState<Record<number, Unit[]>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    CategoryService.getAll().then(setCategories);
  }, []);


  useEffect(() => {
  if (!initialItems?.length) return;

  const loadDependencies = async () => {
    for (const item of initialItems) {

      if (item.categoryId) {
        await loadProducts(item.categoryId);
      }

      if (item.productId) {
        await loadUnits(item.productId);
      }

    }
  };

    loadDependencies();
  }, [initialItems]);

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

  const isEditMode = !!initialItems?.length;

  const submitToParent = () => {
    onSubmit?.({
      requestor_id: isEditMode ? 0 : Number(requestorId),
      items,
    });

    onClose();
  };

  const isFormInvalid = items.some(
    (i) => !i.categoryId || !i.productId || !i.unitId || i.quantity < 1
  ) || (!isEditMode && !requestorId);

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
          <h2 className="text-xl font-semibold dark:text-white">
            {title ?? (isEditMode ? "Edit Order" : "Create Order")}
          </h2>
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
                          const category = categories.find(c => c.id === numericValue);

                          updateItem(index, "categoryId", numericValue);
                          updateItem(index, "categoryName", category?.name ?? "");
                          updateItem(index, "productId", null);
                          updateItem(index, "productName", "");
                          updateItem(index, "unitId", null);
                          updateItem(index, "unitName", "");
         
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
                          const product = productList.find(p => p.id === numericValue);

                          updateItem(index, "productId", numericValue);
                          updateItem(index, "productName", product?.product_name ?? "");
                          updateItem(index, "unitId", null);
                          updateItem(index, "unitName", "");
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
                        onChange={(value) => {
                          const unit = unitList.find(u => u.id === Number(value));
                          updateItem(index, "unitId", value ? Number(value) : null);
                          updateItem(index, "unitName", unit?.name ?? "");
                        }
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
        <span className="dark:text-white">Total Lines</span>
        <span className="font-semibold dark:text-white">{items.length}</span>
      </div>

      <div className="flex justify-between">
        <span className="dark:text-white">Selected</span>
        <span className="font-semibold dark:text-white">
          #{selectedIndex + 1}
        </span>
      </div>
    </div>

  </div>

{/* BOTTOM ACTIONS */}
<div className="pt-5 mt-5 border-t flex flex-col gap-3">

    {/* REQUESTOR */}

    {!isEditMode && (
    <div className="space-y-1">

      <div className="text-xs font-semibold text-gray-500">
        Requestor
      </div>

      {userRole === "ACCOUNTING" ? (
        <Select
          value={requestorId}
          placeholder="Select..."
          options={operationUsers.map((u) => ({
            value: String(u.user_id),
            label: `${u.firstname} - ${u.dealership_name}${
              String(u.user_id) === currentUserId ? " (You)" : ""
            }`,
          }))}
          onChange={(value) => setRequestorId(value)}
        />
      ) : (
        <div className="flex justify-between text-sm px-2 py-1.5 bg-gray-100 dark:bg-gray-700 rounded">

          <span>
            {
              operationUsers.find(
                (u) => String(u.user_id) === currentUserId
              )?.firstname
            }{" - "}
            {
              operationUsers.find(
                (u) => String(u.user_id) === currentUserId
              )?.dealership_name
            }
          </span>

          <span className="text-[10px] text-blue-600">
            You
          </span>

        </div>
      )}

    </div>

    )}


    {/* ACTIONS */}
    <div className="flex flex-col gap-2 pt-1">

      <Button
        size="sm"
        disabled={isFormInvalid}
        onClick={() => setShowConfirm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
      >
        Submit
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={onClose}
      >
        Cancel
      </Button>

    </div>
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