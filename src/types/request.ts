// User who created the request
export interface Requestor {
  id: number;
  firstname: string;
}

// Category master
export interface Category {
  id: number;
  name: string;
}

// Unit master
export interface Unit {
  id: number;
  name: string;
}

// Product master
export interface Product {
  id: number;
  category_id: number;
  product_name: string;
  category: Category;
}

// Items inside a request
export interface RequestItem {
  id: number;
  request_id: number;
  product_id: number;
  unit: Unit;
  quantity: number;
  product: Product;
}

// Main request object
export interface Request {
  id: number;
  request_id: string;
  requestor_id: string;
  status: "PENDING_ACCOUNTING" |"PENDING_SUPERVISOR" |"PENDING_INVENTORY" | "SHIPPED" | "RECEIVED" | "APPROVED" | "REJECTED" | "CLOSED" | "COMPLETED";
  created_at: string;
  updated_at: string;
  requestor: Requestor;
  items: RequestItem[];
  approvals: Approval[];
  shipments: Shipment[];
}

// User who created the request
export interface Approval {
  id: number;
  request_id: number;
  remarks: string;
  created_at: string;
}

// Shipment inside the request
export interface Shipment {
  id: number;
  request_id: number;
  shipped_date: string;
  tracking_link: string;
}

