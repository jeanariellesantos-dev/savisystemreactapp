import URL_API from "../components/api/axios";

type CreateOrderItem = {  
    product_id: number;
    unit_id: number;
    quantity: number;
};

type CreateOrderPayload = {
  status: string;
  items: CreateOrderItem[];
};

export type RequestAction = "APPROVED" | "REJECTED";
export interface ConfirmRequestPayload {
  requestId: number;
  action: RequestAction;
  remarks?: string;
};

export const getPendingRequests = async () => {
   const response = await URL_API.get("/request/pending");

  return response.data;
};

export async function createOrder(payload: CreateOrderPayload) {
  const res = await URL_API.post("/request", payload);
  return res.data;
}

export const confirmRequest = async ({
  requestId,
  action,
  remarks,
}: ConfirmRequestPayload): Promise<void> => {
  await URL_API.post(`/request/${requestId}/approve`, {
    action,
    remarks: remarks ?? null,
  });
};