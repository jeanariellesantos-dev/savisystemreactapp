import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import RequestsTab from "../common/RequestsTab";

// Define the TypeScript interface for the table rows
interface Request {
  id: number; // Unique identifier for each product
  requestID: string;
  productName: string; // Product name
  // image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the Request
}

// Define the table data using the interface
const tableData: Request[] = [
  {
    id: 1,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Delivered"

  },
  {
    id: 2,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Delivered"

  },
  {
    id: 3,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Delivered"

  },
  {
    id: 4,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Delivered"

  },
  {
    id: 5,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Delivered"

  },
];

export default function RecentRequests() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Request
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <RequestsTab />
          {/* <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button> */}
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-red-200 px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>

            Create New Request
          </button>

        </div>
      </div>
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
                Product
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
            {tableData.map((request) => (
              <TableRow key={request.id} className="">
                <TableCell className="py-2">
                   {request.requestID}

                </TableCell>
                <TableCell className="py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  {request.productName}
                </TableCell>
                <TableCell className="py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge 
                    size="sm"
                    color={
                      request.status === "Delivered"
                        ? "success"
                        : request.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                  >
                    {request.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
