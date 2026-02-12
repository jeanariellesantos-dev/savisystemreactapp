import { Dealership } from "../../types/dealership";
import Button from "../ui/button/Button";

type Props = {
  dealerships: Dealership[];
  onEdit: (d: Dealership) => void;
  onDelete: (d: Dealership) => void;
};

export default function DealershipTable({ dealerships, onEdit, onDelete }: Props) {
  if (!dealerships.length)
    return <p className="text-center py-6 text-gray-400">No dealerships found.</p>;

  return (
    <table className="w-full text-sm">
      <thead className="border-b dark:border-gray-700">
        <tr>
          <th className="py-2 text-left">Name</th>
          <th className="text-left">Location</th>
          <th className="text-left">Status</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>

      <tbody>
        {dealerships.map((d) => (
          <tr key={d.id} className="border-b dark:border-gray-800">
            <td className="py-3 font-medium">{d.dealership_name}</td>
            <td>{d.location}</td>

            <td>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  d.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {d.is_active ? "Active" : "Inactive"}
              </span>
            </td>

            <td className="flex justify-end gap-2 py-3">
              <Button size="sm" variant="outline" onClick={() => onEdit(d)}>
                Edit
              </Button>

              <Button size="sm"  onClick={() => onDelete(d)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
