import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Request } from "../../types/request";
import { formatDateTime } from "../utils/date";
import { getRoleFlags } from "../utils/authHelper";
import { getStatusBadgeColor, formatStatusLabel } from "../utils/statusHelper";

type Props = {
  requests: Request[];
  onView: (request: Request) => void;
  onDelete?: (request: Request) => void;
};

const { isAdministrator } = getRoleFlags();

export default function RequestsTable({ requests, onView, onDelete}: Props) {
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
              Date Requested
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

               {/* Date Requested */}
              <TableCell className="py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                {formatDateTime(req.created_at)}
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
              <div className="flex justify-center items-center gap-2">

                {/* VIEW */}
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
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>

                {/* 🗑 DELETE (ADMIN ONLY) */}
                {isAdministrator && (
                  <button
                    onClick={() => onDelete?.(req)}
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
                    title="Delete request"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7v12m6-12v12M10 3h4" />
                    </svg>
                  </button>
                )}

              </div>
            </TableCell>
            </TableRow>
          ))}

          {/* Empty State */}
          {requests.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-gray-500"
              >
                No orders found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
