import { Category } from "../../types/category";
import Button from "../ui/button/Button";

type Props = {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
};

export default function CategoryTable({ categories, onEdit, onDelete }: Props) {
  return (
    <table className="w-full text-sm">
      <thead className="text-left border-b dark:border-gray-700">
        <tr>
          <th className="py-2">Name</th>
          <th className="py-2 text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {categories.map((c) => (
          <tr key={c.id} className="border-b dark:border-gray-800">
            <td className="py-3">{c.name}</td>

            <td className="py-3 flex justify-end gap-2">
              <Button size="sm" onClick={() => onEdit(c)}>
                Edit
              </Button>

              <Button size="sm" onClick={() => onDelete(c)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
