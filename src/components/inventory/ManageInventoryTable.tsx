import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import Badge from "../ui/badge/Badge";
import { formatDateTime } from "../utils/date";

export default function InventoryMovementsTable({
  data,
  onView,
  onReverse,
}: any) {
  return (
    <div className="max-w-full overflow-x-auto">
      <Table>

        {/* HEADER */}
        <TableHeader className="border-y border-gray-100 dark:border-gray-800">
          <TableRow>

            <TableCell isHeader className="py-3 text-start text-gray-500 text-theme-xs">
              Date
            </TableCell>

            <TableCell isHeader className="py-3 text-start text-gray-500 text-theme-xs">
              Product
            </TableCell>

            <TableCell isHeader className="py-3 text-start text-gray-500 text-theme-xs">
              Unit
            </TableCell>

            <TableCell isHeader className="py-3 text-start text-gray-500 text-theme-xs">
              Dealership
            </TableCell>

            <TableCell isHeader className="py-3 text-center text-gray-500 text-theme-xs">
              Type
            </TableCell>

            <TableCell isHeader className="py-3 text-right text-gray-500 text-theme-xs">
              Qty
            </TableCell>

            <TableCell isHeader className="py-3 text-center text-gray-500 text-theme-xs">
              User
            </TableCell>

            <TableCell isHeader className="py-3 text-center text-gray-500 text-theme-xs">
              Action
            </TableCell>

          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">

          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-gray-500">
                No movements found
              </TableCell>
            </TableRow>
          ) : (
            data.map((item: any, i: number) => (

              <TableRow key={i}>

                {/* DATE */}
                <TableCell className="py-2 text-gray-500 text-theme-sm">
                  {formatDateTime(item.created_at)}
                </TableCell>

                {/* PRODUCT */}
                <TableCell className="py-2 font-medium text-gray-800 dark:text-white text-theme-sm">
                  {item.product}
                </TableCell>

                {/* UNIT */}
                <TableCell className="py-2 text-gray-500 text-theme-sm">
                  {item.unit}
                </TableCell>

                {/* DEALERSHIP */}
                <TableCell className="py-2 text-gray-500 text-theme-sm">
                  {item.dealership}
                </TableCell>

                {/* TYPE */}
                <TableCell className="py-2 text-center">
                  <Badge
                    size="sm"
                    color={
                      item.type === "IN"
                        ? "success"
                        : item.type === "OUT"
                        ? "error"
                        : "warning"
                    }
                  >
                    {item.type}
                  </Badge>
                </TableCell>

                {/* QTY */}
                <TableCell className="py-2 text-right font-semibold text-theme-sm">
                  {item.type === "OUT"
                    ? `-${Math.abs(item.quantity)}`
                    : item.quantity}
                </TableCell>

                {/* USER */}
                <TableCell className="py-2 text-center text-gray-500 text-theme-sm">
                  {item.user}
                </TableCell>

                {/* 🔥 ACTIONS */}
                <TableCell className="py-2 text-center">
                  <div className="flex items-center justify-center gap-2">

                    {/* VIEW */}
                    <button
                      onClick={() => onView(item)}
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

                    {/* REVERSE */}
                    <button
                      onClick={() => onReverse(item)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border text-red-600 hover:bg-red-600 hover:text-white transition"
                      title="Reverse movement"
                    >
                      ↺
                    </button>

                  </div>
                </TableCell>

              </TableRow>
            ))
          )}

        </TableBody>

      </Table>
    </div>
  );
}