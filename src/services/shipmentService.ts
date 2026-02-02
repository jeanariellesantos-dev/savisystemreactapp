import { ShipmentForm } from "../types/shipment";
import URL_API from "../components/api/axios";

type CreateShipmentPayload = {  
    remarks?: string;
    shipments : ShipmentForm[];
};

export async function markRequestAsShipped(  
requestId: number,
  payload: CreateShipmentPayload) {
  return URL_API.post(
    `/request/${requestId}/fulfill`,
    payload
  );
}

export async function markRequestAsReceived(  
requestId: number,
  payload: CreateShipmentPayload) {
  return URL_API.post(
    `/request/${requestId}/receive`,
    payload
  );
}