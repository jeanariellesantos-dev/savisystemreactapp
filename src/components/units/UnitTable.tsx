import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Unit } from "../../types/unit";
import Badge from "../ui/badge/Badge";

type Props = {
  units: Unit[];
  onEdit: (unit: Unit) => void;
  onToggle: (unit: Unit) => void;
};

export default function UnitTable({
  units,
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
              Unit Name
            </TableCell>

            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
            >
              Abbreviation
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
          {units.map((u) => (
            <TableRow key={u.id}>
              {/* NAME */}
              <TableCell className="py-3 text-gray-800 dark:text-white/90 text-theme-sm">
                <span className="font-medium">{u.name}</span>
              </TableCell>

              {/* ABBREVIATION */}
              <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                {u.abbreviation || "—"}
              </TableCell>

                {/* STATUS */}
              <TableCell className="py-2 text-center">
                <Badge
                  size="sm"
                  color={u.is_active ? "success" : "error"}
                >
                  {u.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              {/* ACTIONS */}
              <TableCell className="py-3 text-center">
                <div className="flex justify-center gap-3">

                  {/* EDIT */}
                  <button
                    onClick={() => onEdit(u)}
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
                    title="Edit unit"
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
                    onClick={() => onToggle(u)}
                    className={`
                      inline-flex items-center justify-center
                      w-9 h-9
                      rounded-lg
                      border border-gray-200
                      dark:border-gray-700
                      transition
                      ${
                        u.is_active
                          ? "text-red-600 hover:bg-red-600 hover:text-white"
                          : "text-green-600 hover:bg-green-600 hover:text-white"
                      }
                    `}
                    title={u.is_active ? "Deactivate" : "Activate"}
                  >
                    {u.is_active ? (
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
          {units.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="py-10 text-center text-gray-400 dark:text-gray-500"
              >
                No units found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
