import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Dealership } from "../../types/dealership";

type Props = {
  dealerships: Dealership[];
  onEdit: (d: Dealership) => void;
  onToggle: (d: Dealership) => void;
};

export default function DealershipTable({
  dealerships,
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
              Dealership
            </TableCell>

            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
            >
              Location
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
          {dealerships.map((d) => (
            <TableRow key={d.id}>
              {/* DEALERSHIP NAME */}
              <TableCell className="py-2 text-gray-500 text-theme-sm dark:text-gray-400">
                <span className="font-medium text-gray-800 dark:text-white/90">
                  {d.dealership_name}
                </span>
              </TableCell>

              {/* LOCATION */}
              <TableCell className="py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                {d.location}
              </TableCell>

              {/* STATUS */}
              <TableCell className="py-2 text-center">
                <Badge
                  size="sm"
                  color={d.is_active ? "success" : "error"}
                >
                  {d.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>

              {/* OPERATION */}
              <TableCell className="py-2 text-center">
                <div className="flex justify-center items-center gap-2">

                  {/* EDIT BUTTON */}
                  <button
                    onClick={() => onEdit(d)}
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
                    onClick={() => onToggle(d)}
                    className={`
                      inline-flex items-center justify-center
                      w-9 h-9
                      rounded-lg
                      border border-gray-200
                      dark:border-gray-700
                      transition
                      ${
                        d.is_active
                          ? "text-red-600 hover:bg-red-600 hover:text-white"
                          : "text-green-600 hover:bg-green-600 hover:text-white"
                      }
                    `}
                    title={d.is_active ? "Deactivate" : "Activate"}
                  >
                    {d.is_active ? (
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
          {dealerships.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-8 text-center text-gray-500"
              >
                No dealerships found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
