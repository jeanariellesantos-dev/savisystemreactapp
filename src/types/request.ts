import { RequestStatus } from "../types/status";

export type CreateOrderItem = {  
    product_id: number | null;
    unit_id: number | null;
    quantity: number;
};

export type CreateOrderPayload = {
  status: string;
  items: CreateOrderItem[];
};

export type RequestAction = "APPROVED" | "REJECTED";
export interface ConfirmRequestPayload {
  requestId: number;
  action: RequestAction;
  remarks?: string;
  items: CreateOrderItem[];
};


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
  status: RequestStatus;
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

