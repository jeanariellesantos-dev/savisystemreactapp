import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import { useState } from "react";

export default function InventoryMovementModal({
  isOpen,
  onClose,
  product,
  onSubmit,
  dealerships,
}: any) {

  const [form, setForm] = useState({
    type: "IN",
    quantity: 1,
    remarks: "",
    dealership_id: "", 
  });

  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen || !product) return null;

const isInvalid =
  !form.quantity ||
  form.quantity < 1 ||
  !form.dealership_id; // ✅ require dealership

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">

        <div className="rounded-3xl bg-white p-6 dark:bg-gray-900">

          {/* HEADER */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold dark:text-white">
              Inventory Movement
            </h2>
            <p className="text-xs text-gray-500">
              Perform stock transaction for selected product
            </p>
          </div>

          {/* PRODUCT INFO */}
          <div className="rounded-xl border p-4 bg-gray-50 dark:bg-gray-800 mb-4">
            <p className="text-sm font-semibold dark:text-white">
              {product.product_name}
            </p>
            <p className="text-xs text-gray-500">
              Current Stock: <b>{product.stock}</b>
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-4">

            {/* TYPE */}
            <div>
              <Label>Type</Label>
              <Select
                value={form.type}
                options={[
                  { value: "IN", label: "Stock In" },
                  { value: "OUT", label: "Stock Out" },
                  { value: "ADJUSTMENT", label: "Adjustment" },
                ]}
                onChange={(value) =>
                  setForm({ ...form, type: value })
                }
              />
            </div>

            {/* QUANTITY */}
            <div>
              <Label>Quantity</Label>
              <Input
                min={1}
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* DEALERSHIP */}
            <div>
              <Label>Dealership</Label>
              <Select
                value={form.dealership_id}
                placeholder="Select dealership"
                options={dealerships.map((d: any) => ({
                  value: d.id,
                  label: d.dealership_name,
                }))}
                onChange={(value) =>
                  setForm({ ...form, dealership_id: value })
                }
              />
            </div>

            {/* REMARKS (ENLARGED) */}
            <div>
              <Label>Remarks</Label>
              <textarea
                rows={4} // ✅ increased size
                placeholder="Enter remarks..."
                className="w-full rounded-lg border p-3 text-sm 
                           dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                value={form.remarks}
                onChange={(e) =>
                  setForm({ ...form, remarks: e.target.value })
                }
              />
            </div>

          </div>

          {/* ACTIONS */}
          <div className="mt-6 flex justify-end gap-2">

            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={isInvalid}
              onClick={() => setShowConfirm(true)}
            >
              Submit
            </Button>

          </div>

        </div>
      </Modal>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <Modal isOpen onClose={() => setShowConfirm(false)} className="max-w-md">
          <div className="p-6">

            <h3 className="text-lg font-semibold">
              Confirm Movement
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Please confirm this inventory transaction.
            </p>

            <div className="mt-4 text-sm space-y-2">
              <div>Product: <b>{product.product_name}</b></div>
              <div>Type: <b>{form.type}</b></div>
              <div>Quantity: <b>{form.quantity}</b></div>
            </div>

            <div>
              Dealership:{" "}
              <b>
                {
                  dealerships.find((d: any) => d.id == form.dealership_id)
                    ?.dealership_name
                }
              </b>
            </div>

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
                  onSubmit({
                    product_id: product.id,
                    ...form,
                  });
                }}
              >
                Confirm
              </Button>
            </div>

          </div>
        </Modal>
      )}
    </>
  );
}