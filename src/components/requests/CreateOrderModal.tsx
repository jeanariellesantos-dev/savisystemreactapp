import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useState } from "react";
import { createOrder } from "../../services/orderService";

type Product = {
  id: number;
  name: string;
  unit: string;
};

type OrderItem = {
  productId: string;
  quantity: number;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (items: OrderItem[]) => void;
   onSuccess?: () => void; // ✅ ADD THIS
};

const products: Product[] = [
  { id: 1, name: "Car Soap", unit: "bottle" },
  { id: 2, name: "Engine Oil", unit: "liter" },
  { id: 3, name: "Microfiber Cloth", unit: "piece" },
];

export default function CreateOrderModal({
  isOpen,
  onClose,
  onSubmit,
    onSuccess,
}: Props) {
  const [items, setItems] = useState<OrderItem[]>([
    { productId: "", quantity: 1 },
  ]);

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = <K extends keyof OrderItem>(
    index: number,
    field: K,
    value: OrderItem[K]
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    

  const handleSubmit = async () => {

    
     try {
      setLoading(true);

      // 🔥 Transform payload for backend
        const payload = {
        status: "PENDING_ACCOUNTING", // ✅ INCLUDED
        items: items.map((item) => ({
            product_id: Number(item.productId),
            quantity: item.quantity,
        })),
        };

      await createOrder(payload);

      onSuccess?.();   // refresh list
      onClose();       // close modal
      setItems([{ productId: "", quantity: 1 }]); // reset form
    } catch (err) {
      console.error("Failed to create order", err);
      alert("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (


    
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Create Order
          </h4>
        </div>

        <form className="flex flex-col">
          <div className="mb-3 custom-scrollbar relative h-[400px] overflow-y-auto rounded-2xl bg-gray-50 px-4 py-4 pb-6 shadow-inner dark:bg-gray-800/40">
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
              Order Items
            </h5>

            <div className="space-y-4">
              {items.map((item, index) => {
                const selectedProduct = products.find(
                  (p) => p.id === Number(item.productId)
                );

                return (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-end border rounded-xl p-3"
                  >
                    {/* Product */}
                    <div className="col-span-6">
                      <Label>Product</Label>
                      <select
                        value={item.productId}
                        onChange={(e) =>
                          updateItem(index, "productId", e.target.value)
                        }
                        className="w-full rounded-md border p-2 dark:text-white"
                      >
                        <option value="">Select product</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-4">
                      <Label>
                        Quantity{" "}
                        {selectedProduct && (
                          <span className="text-xs text-gray-500">
                            ({selectedProduct.unit})
                          </span>
                        )}
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", Number(e.target.value))
                        }
                      />
                    </div>

                    {/* Remove */}
                    <div className="col-span-2 flex justify-end">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-6 0V5a1 1 0 011-1h4a1 1 0 011 1v2"
                            />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Product */}
            <button
              type="button"
              onClick={addItem}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-400 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <span className="text-lg">+</span>
              Add another product
            </button>
          </div>

          <div className="flex items-center gap-3 px-2 mt-1 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button size="sm" onClick={() => setShowConfirm(true)}>
            Submit
            </Button>
          </div>
        </form>
      </div>
    </Modal>







    
  );
}
