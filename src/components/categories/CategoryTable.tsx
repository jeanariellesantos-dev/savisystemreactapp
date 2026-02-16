import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Category } from "../../types/category";

type Props = {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onToggle: (cat: Category) => void;
};

export default function CategoryTable({
  categories,
  onEdit,
  onToggle,
}: Props) {
  return (
    <div className="max-w-full overflow-x-auto">
      <Table>
        {/* ================= HEADER ================= */}
        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
          <TableRow>
            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Category
            </TableCell>

            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
            >
              Slug
            </TableCell>

            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
            >
              Status
            </TableCell>

            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
            >
              Operation
            </TableCell>
          </TableRow>
        </TableHeader>

        {/* ================= BODY ================= */}
        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {categories.map((c) => (
            <TableRow key={c.id}>
              {/* CATEGORY NAME */}
              <TableCell className="py-2 text-gray-500 text-theme-sm dark:text-gray-400">
                <span className="font-medium text-gray-800 dark:text-white/90">
                  {c.name}
                </span>
              </TableCell>

              {/* SLUG */}
              <TableCell className="py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                {c.slug ?? "—"}
              </TableCell>

              {/* STATUS */}
              <TableCell className="py-2 text-center">
                <Badge
                  size="sm"
                  color={c.is_active ? "success" : "error"}
                >
                  {c.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              {/* OPERATION */}
              <TableCell className="py-2 text-center">
                <div className="flex justify-center items-center gap-2">
                  
                  {/* EDIT BUTTON */}
                  <button
                    onClick={() => onEdit(c)}
                    className="
                      inline-flex items-center justify-center
                      w-9 h-9
                      rounded-lg
                      border border-gray-200
                      text-blue-600
                      hover:bg-blue-600 hover:text-white
                      dark:border-gray-700
                      transition
                    "
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z"
                      />
                    </svg>
                  </button>

                  {/* TOGGLE STATUS BUTTON */}
                  <button
                    onClick={() => onToggle(c)}
                    className="
                      inline-flex items-center justify-center
                      w-9 h-9
                      rounded-lg
                      border border-gray-200
                      text-red-600
                      hover:bg-red-600 hover:text-white
                      dark:border-gray-700
                      transition
                    "
                    title={c.is_active ? "Deactivate" : "Activate"}
                  >
                    {c.is_active ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>

                </div>
              </TableCell>
            </TableRow>
          ))}

          {/* EMPTY STATE */}
          {categories.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-8 text-center text-gray-500"
              >
                No categories found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
