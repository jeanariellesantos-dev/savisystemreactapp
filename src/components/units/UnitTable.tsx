import { Unit } from "../../types/unit";
import Button from "../ui/button/Button";

type Props = {
  units: Unit[];
  onEdit: (unit: Unit) => void;
  onDelete: (unit: Unit) => void;
};

export default function UnitTable({ units, onEdit, onDelete }: Props) {
  if (!units.length)
    return (
      <p className="text-center py-6 text-gray-400">
        No units found.
      </p>
    );

  return (
    <table className="w-full text-sm">
      <thead className="border-b dark:border-gray-700">
        <tr>
          <th className="py-2 text-left">Name</th>
          <th className="text-left">Abbreviation</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {units.map((u) => (
          <tr key={u.id} className="border-b dark:border-gray-800">
            <td className="py-3 font-medium">{u.name}</td>
            <td>{u.abbreviation}</td>

            <td className="flex justify-end gap-2 py-3">
              <Button size="sm" variant="outline" onClick={() => onEdit(u)}>
                Edit
              </Button>

              <Button size="sm" onClick={() => onDelete(u)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
