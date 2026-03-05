export type ShipmentStatus = "SHIPPED" | "RECEIVED";

export type ShipmentForm = {
  shipped_date: string; 
  received_date: string;
  tracking_link: string;
};