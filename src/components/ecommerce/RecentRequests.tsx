import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import RequestsTab from "../common/RequestsTab";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import { Modal } from "../ui/modal";
import { useModal } from "../../hooks/useModal";
import { useState } from "react";
import ViewOrderModal  from "../common/ViewOrderModel";



// Define the TypeScript interface for the table rows
interface Request {
  id: number; // Unique identifier for each product
  requestID: string;
  productName: string; // Product name
  // image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the Request
    remarks: string; // Reason for rejection
}

// Define the table data using the interface
const tableData: Request[] = [
  {
    id: 1,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Delivered",
    remarks: "Approved"

  },
  {
    id: 2,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Delivered",
    remarks: "Approved"

  },
  {
    id: 3,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Delivered",
    remarks: "Approved"

  },
  {
    id: 4,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Delivered",
    remarks: "Approved"
  },
  {
    id: 5,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Delivered",
    remarks: "Approved"

  },
];

export default function RecentRequests() {

    const [message, setDescription] = useState("");
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const { isOpen, openModal, closeModal } = useModal();
    
    const handleSave = () => {
      // Handle save logic here
      console.log("Saving changes...");
      closeModal();
    };

    const handleApprove = (item: any) => {
    console.log("Approved:", item.id);
    // call API here
    };

    const handleReject = (item: any, reason: string) => {
     console.log("Rejected:", item.id, reason);
    // call API here
    };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Active Orders
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <RequestsTab />
          {/* <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </button> */}
          <button onClick={openModal} 
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
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
            Create Order
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
                <TableCell className="py-2 text-gray-500 text-theme-sm dark:text-gray-400">
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
                <TableCell className="py-2 text-center text-gray-500 text-theme-sm dark:text-gray-400">
                  <button  onClick={() => setSelectedItem(request)}
                  className="inline-flex items-center justify-center
                        w-8 h-8
                        border border-gray-300
                        text-blue-600
                        hover:text-white
                        hover:bg-blue-600
                        rounded-md
                        transition"
                      title="View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Create Order
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 pb-3">
              <div>

              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Order Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
                  <div className="col-span-1 lg:col-span-1">
                    <Label>Product</Label>
                    <Input type="text" placeholder="eg. Car Soap" />
                  </div>

                  <div className="col-span-1 lg:col-span-1">
                    <Label>Description</Label>
                    <TextArea
                        placeholder={"Enter a description of your order here..."}
                        onChange={(value) => setDescription(value)}
                        rows={6}
                      />
                  </div>

                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-1 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Modal>

            {/* Modal */}
      {selectedItem && (
        <ViewOrderModal
          isOpen={!!selectedItem}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

    </div>
  );
}
