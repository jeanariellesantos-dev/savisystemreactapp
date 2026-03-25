import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";

type Props = {
  movements: any[];
  onSelect?: (item: any) => void;
};

function formatDate(dateString: string | null) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export default function InventoryTable({ movements, onSelect }: Props) {
  return (
    <div className="max-w-full overflow-x-auto">

      <Table>
        {/* HEADER */}
        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
          <TableRow>

            <TableCell
              isHeader
              className="py-3 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Product
            </TableCell>

            <TableCell
              isHeader
              className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Stock
            </TableCell>

            <TableCell
              isHeader
              className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Last Ordered
            </TableCell>

            <TableCell
              isHeader
              className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Status
            </TableCell>

            <TableCell
              isHeader
              className="py-3 text-center text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              Action
            </TableCell>

          </TableRow>
        </TableHeader>

        {/* BODY */}
        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">

          {movements.map((m) => {
            const isLowStock = m.stock <= 5;

            return (
              <TableRow key={m.id}>

                {/* PRODUCT */}
                <TableCell className="py-2 text-gray-500 text-theme-sm dark:text-gray-400">
                  {m.product_name}
                </TableCell>

                {/* STOCK */}
                <TableCell className="py-2 text-center text-theme-sm">
                  <span
                    className={`font-medium ${
                      isLowStock
                        ? "text-red-500"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {m.stock}
                  </span>
                </TableCell>

                {/* LAST ORDERED */}
                <TableCell className="py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  {formatDate(m.last_ordered_at)}
                </TableCell>

                {/* STATUS */}
                <TableCell className="py-2 text-center">
                  {isLowStock ? (
                    <Badge size="sm" color="error">
                      Low Stock
                    </Badge>
                  ) : (
                    <Badge size="sm" color="success">
                      OK
                    </Badge>
                  )}
                </TableCell>

                {/* ACTION */}
                <TableCell className="py-2 text-center">
                  <button
                    onClick={() => onSelect?.(m)}
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
                    title="View / Update"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M15 12H9m12 0A9 9 0 11 3 12a9 9 0 0118 0z" />
                    </svg>
                  </button>
                </TableCell>

              </TableRow>
            );
          })}

          {/* EMPTY STATE */}
          {movements.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-gray-500"
              >
                No inventory data found
              </TableCell>
            </TableRow>
          )}

        </TableBody>
      </Table>
    </div>
  );
}