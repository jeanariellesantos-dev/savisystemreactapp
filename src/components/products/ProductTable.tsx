import { Product } from "../../types/product";
import Button from "../ui/button/Button";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({ products, onEdit, onDelete }: Props) {
  if (!products.length)
    return (
      <p className="text-center py-6 text-gray-400">
        No products found.
      </p>
    );

  return (
    <table className="w-full text-sm">
      <thead className="border-b dark:border-gray-700">
        <tr>
          <th className="py-2 text-left">Name</th>
          <th className="text-left">Category</th>
          <th className="text-left">Units</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p) => (
          <tr key={p.id} className="border-b dark:border-gray-800">
            <td className="py-3 font-medium">{p.product_name}</td>

            <td>{p.category?.name ?? "—"}</td>

            <td>
              {p.units?.length
                ? p.units.map((u) => u.name).join(", ")
                : "—"}
            </td>

            <td className="flex justify-end gap-2 py-3">
              <Button size="sm"  onClick={() => onEdit(p)}>
                Edit
              </Button>

              <Button size="sm" onClick={() => onDelete(p)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
