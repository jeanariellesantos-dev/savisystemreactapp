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
  status: "Pending" | "Rejected"| "Fulfilled"; // Status of the Request
    remarks: string; // Reason for rejection
}

// Define the table data using the interface
const tableData: Request[] = [
  {
    id: 1,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Pending",
    remarks: "Approved"

  },
  {
    id: 2,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Fulfilled",
    remarks: "Approved"

  },
  {
    id: 3,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Rejected",
    remarks: "No supplies. Please try again tomorrow"

  },
  {
    id: 4,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Fulfilled",
    remarks: "Approved"
  },
  {
    id: 5,
    requestID: "REQ1",
    productName: "Laptop",
    status: "Fulfilled",
    remarks: "Approved"

  },
];

const products = [
  { id: 1, name: "Car Soap", unit: "bottle" },
  { id: 2, name: "Engine Oil", unit: "liter" },
  { id: 3, name: "Microfiber Cloth", unit: "piece" },
];
type OrderItem = {
  productId: string;
  quantity: number;
};
export default function RecentRequests() {

    

    const [message, setDescription] = useState("");
    const [selectedItem, setSelectedItem] = useState<any>(null);
      const [items, setItems] = useState<OrderItem[]>([
        { productId: "", quantity: 1 },
      ]);

      const addItem = () => {
       setItems([...items, { productId: "", quantity: 1 }]);
      };

      const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
      };

      const updateItem = <K extends keyof OrderItem>(
        index: number,
        field: K,
        value: OrderItem[K]
      ) => {
        setItems((prev) => {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            [field]: value,
          };
          return updated;
        });
      };

    const { isOpen, openModal, closeModal } = useModal();
    
    const handleSave = () => {
      // Handle save logic here
        const payload = {
    items
  };
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
                      request.status === "Fulfilled"
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
                    <button
                      onClick={() => setSelectedItem(request)}
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
                </TableCell>
              </TableRow>

              
            ))
            
            
            }

            {tableData.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-gray-500">
                  No orders found.
                </TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
      </div>

    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-5 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Create Order
            </h4>
          </div>
          
          <form className="flex flex-col">
           <div className="mb-3 custom-scrollbar relative h-[400px] overflow-y-auto rounded-2xl bg-gray-50 px-4 py-4 pb-6 shadow-inner dark:bg-gray-800/40">

              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
                Order Items
              </h5>

          <div className="space-y-4">
            {items.map((item, index) => {
              const selectedProduct = products.find(
                (p) => p.id === Number(item.productId)
              );

              return (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 items-end border rounded-xl p-3"
                >
                  {/* Product */}
                  <div className="col-span-6">
                    <Label>Product</Label>
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        updateItem(index, "productId", e.target.value)
                      }
                      className="w-full rounded-md border p-2  dark:text-white"
                    >
                      <option value="">Select product</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4">
                    <Label>
                      Quantity{" "}
                      {selectedProduct && (
                        <span className="text-xs text-gray-500 " >
                          ({selectedProduct.unit})
                        </span>
                      )}
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                    />
                  </div>

                  {/* Remove */}
                  <div className="col-span-2 flex justify-end">
                    {items.length > 1 && (
                      <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="group inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-6 0V5a1 1 0 011-1h4a1 1 0 011 1v2"
                        />
                      </svg>
                      Remove
                    </button>

                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Product */}
          <button
            type="button"
            onClick={addItem}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-dashed border-blue-400 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <span className="text-lg">+</span>
            Add another product
          </button>

          {/* Description
          <div className="mt-6">
            <Label>Description</Label>
            <TextArea
              placeholder="Enter a description of your order here..."
              rows={4}
              onChange={(value) => setDescription(value)}
            />
          </div> */}
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
