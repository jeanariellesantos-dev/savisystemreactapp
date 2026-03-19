import { ShipmentForm, CreateShipmentPayload } from "../types/shipment";
import URL_API from "../components/api/axios";

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