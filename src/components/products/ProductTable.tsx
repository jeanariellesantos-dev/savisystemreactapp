import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { Product } from "../../types/product";

type Props = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({
  products,
  onEdit,
  onDelete,
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
              Product
            </TableCell>

            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
            >
              Category
            </TableCell>

            <TableCell
              isHeader
              className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400"
            >
              Units
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
          {products.map((product) => (
            <TableRow key={product.id}>
              {/* PRODUCT NAME */}
              <TableCell className="py-3 text-gray-800 dark:text-white/90 text-theme-sm">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {product.product_name}
                  </span>
                </div>
              </TableCell>

              {/* CATEGORY */}
              <TableCell className="py-3 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                {product.category?.name ?? "—"}
              </TableCell>

              {/* UNITS */}
              <TableCell className="py-3 text-center">
                <div className="flex flex-wrap justify-center gap-2">
                  {product.units?.length ? (
                    product.units.map((unit) => (
                      <Badge key={unit.id} size="sm" color="primary">
                        {unit.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">No units</span>
                  )}
                </div>
              </TableCell>

              {/* ACTIONS */}
              <TableCell className="py-3 text-center">
                <div className="flex justify-center gap-3">

                  {/* EDIT */}
                  <button
                    onClick={() => onEdit(product)}
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
                    title="Edit product"
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

                  {/* DELETE */}
                  <button
                    onClick={() => onDelete(product)}
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
                    title="Delete product"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                </div>
              </TableCell>
            </TableRow>
          ))}

          {/* EMPTY STATE */}
          {products.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-8 text-center text-gray-400"
              >
                No products found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
