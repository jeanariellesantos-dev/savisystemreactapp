import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Request } from "../../types/request";

import { getStatusBadgeColor, formatStatusLabel } from "../utils/statusHelper";

type Props = {
  requests: Request[];
  onView: (request: Request) => void;
};

export default function RequestsTable({ requests, onView }: Props) {
  return (
    <div className="max-w-full overflow-x-auto">
      <Table>
        {/* Table Header */}
        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
          <TableRow>
            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
            >
              Request ID
            </TableCell>

            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
            >
              Requested By
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

        {/* Table Body */}
        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
          {requests.map((req) => (
            <TableRow key={req.id}>
              {/* Request ID */}
              <TableCell className="py-2 text-gray-500 text-theme-sm dark:text-gray-400">
                {req.request_id}
              </TableCell>

              {/* Requestor */}
              <TableCell className="py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                {req.requestor?.firstname ?? "—"}
              </TableCell>

              {/* Status */}
              <TableCell className="py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                  size="sm"
                  color={getStatusBadgeColor(req.status)}
                >
                  {formatStatusLabel(req.status)}
                </Badge>
              </TableCell>

              {/* Operation */}
              <TableCell className="py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                <button
                  onClick={() => onView(req)}
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
                  title="View details"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </TableCell>
            </TableRow>
          ))}

          {/* Empty State */}
          {requests.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-8 text-center text-gray-500"
              >
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
