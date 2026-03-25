import { useState, useEffect } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

export default function ManageInventoryModal({
  isOpen,
  onClose,
  onSubmit,
  item,
  products,
  dealerships,
  units,
}: any) {

  const isView = !!item && !onSubmit;

  const [form, setForm] = useState({
    product_id: 0,
    dealership_id: "",
    unit_id: 0,
    type: "IN",
    quantity: 0,
    remarks: "",
  });

  useEffect(() => {
    if (!item) {
      setForm({
        product_id: 0,
        dealership_id: "",
        unit_id: 0,
        type: "IN",
        quantity: 0,
        remarks: "",
      });
    }
  }, [item]);

  // 🔹 selected product
  const selectedProduct = products.find(
    (p: any) => String(p.id) === String(form.product_id)
  );

  const currentStock = selectedProduct?.stock ?? 0;
  const isOut = form.type === "OUT";

  // 🔹 units per product
  const productUnits = units[Number(form.product_id)] || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="
        w-[95vw] max-w-[520px]
        rounded-3xl
        bg-white/90 backdrop-blur-xl
        border border-gray-200/70
        shadow-xl
        dark:bg-gray-900/90
        dark:border-gray-700
        transition-all duration-200
      "
    >

      {/* ================= HEADER ================= */}
      <div className="px-6 pt-5 pb-3 border-b flex justify-between items-center">

        <div>
          <h2 className="text-lg font-semibold dark:text-white">
            {isView ? "Movement Details" : "New Movement"}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Select product and movement details
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          ✕
        </button>

      </div>

      {/* ================= BODY ================= */}
      <div className="p-5 space-y-4">

        {isView ? (
          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-gray-500">Type</span>
              <span className="font-semibold">{item.type}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Quantity</span>
              <span className="font-semibold">
                {item.type === "OUT"
                  ? `-${Math.abs(item.quantity)}`
                  : item.quantity}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">User</span>
              <span className="font-medium">{item.user}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Date</span>
              <span className="font-medium">
                {new Date(item.created_at).toLocaleString()}
              </span>
            </div>

            {item.remarks && (
              <div className="pt-3 border-t">
                <p className="text-xs text-gray-500 mb-1">Remarks</p>
                <p className="text-sm dark:text-gray-300">
                  {item.remarks}
                </p>
              </div>
            )}

          </div>
        ) : (
          <>
            {/* PRODUCT + UNIT */}
            <div className="grid grid-cols-2 gap-3">

              {/* PRODUCT */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Product
                </label>
                <select
                  value={form.product_id || ""}   // ✅ ADD THIS
                  onChange={(e) => {
                    const productId = Number(e.target.value);

                    const productUnits = units[productId] || [];
                    const firstUnit = productUnits[0];

                    setForm((prev) => ({
                      ...prev,
                      product_id: productId,
                      unit_id: firstUnit?.id || 0,
                    }));
                  }}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="">Select product</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.product_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* UNIT */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Unit
                </label>
                <select
                  value={form.unit_id || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      unit_id: Number(e.target.value),
                    }))
                  }
                  disabled={!form.product_id}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="">Select unit</option>

                  {productUnits.map((u: any) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* DEALERSHIP + TYPE */}
            <div className="grid grid-cols-2 gap-3">

              {/* DEALERSHIP */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Dealership
                </label>

                <select
                  value={form.dealership_id}
                  onChange={(e) =>
                    setForm({ ...form, dealership_id: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select dealership</option>

                  {dealerships.map((d: any) => (
                    <option key={d.id} value={d.id}>
                      {d.dealership_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* TYPE */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">
                  Movement Type
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="IN">Stock In</option>
                  <option value="OUT">Stock Out</option>
                  <option value="ADJUSTMENT">Adjustment</option>
                </select>
              </div>

            </div>

            {/* STOCK */}
            <div className="rounded-xl border p-4 flex justify-between items-center bg-blue-50 border-blue-200">
              <span className="text-xs text-gray-500">Current Stock</span>
              <span className="text-lg font-bold text-blue-600">
                {currentStock}
              </span>
            </div>

            {/* QUANTITY */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Quantity
              </label>

              <input
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

              {isOut && form.quantity > currentStock && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  ⚠ Insufficient stock
                </p>
              )}
            </div>

            {/* REMARKS */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">
                Remarks
              </label>

              <textarea
                value={form.remarks}
                onChange={(e) =>
                  setForm({ ...form, remarks: e.target.value })
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter reason..."
              />
            </div>
          </>
        )}

      </div>

      {/* ================= FOOTER ================= */}
      <div className="px-6 py-4 border-t flex justify-between items-center">

        <span className="text-xs text-gray-400">
          Required fields must be filled
        </span>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          {!isView && (
            <Button
              size="sm"
              disabled={
                !form.product_id ||
                !form.unit_id ||
                !form.dealership_id ||
                form.quantity <= 0 ||
                (isOut && form.quantity > currentStock)
              }
              onClick={() =>
                onSubmit({
                  product_id: Number(form.product_id),
                  dealership_id: Number(form.dealership_id),
                  unit_id: Number(form.unit_id),
                  type: form.type,
                  quantity: form.quantity,
                  remarks: form.remarks,
                })
              }
            >
              Save Movement
            </Button>
          )}

        </div>

      </div>

    </Modal>
  );
}