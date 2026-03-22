import { useState } from "react";

export default function InventoryModal({
  isOpen,
  products,
  dealerships,
  onClose,
  onSubmit,
}: any) {
  const [form, setForm] = useState({
    product_id: "",
    dealership_id: "",
    type: "IN",
    quantity: "",
    remarks: "",
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl p-6 w-[400px]">
        <h3 className="text-lg font-semibold mb-4">Create Movement</h3>

        {/* Product
        <select
          className="w-full mb-3 border p-2"
          onChange={(e) => setForm({ ...form, product_id: e.target.value })}
        >
          <option>Select Product</option>
          {products.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.product_name}
            </option>
          ))}
        </select> */}

        {/* Type */}
        <select
          className="w-full mb-3 border p-2"
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
          <option value="ADJUSTMENT">ADJUSTMENT</option>
        </select>

        {/* Quantity */}
        <input
          type="number"
          placeholder="Quantity"
          className="w-full mb-3 border p-2"
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />

        {/* Remarks */}
        <input
          placeholder="Remarks"
          className="w-full mb-3 border p-2"
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => onSubmit(form)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}