import URL_API from "../components/api/axios";

type CreateOrderItem = {  
    product_id: number | null;
    unit_id: number | null;
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

export const getRequests = (filter: string, page = 1) => {
  const url =
    filter === "ACTIVE"
      ? "/request/pending"
      : "/request/history";

  return URL_API.get(`${url}?page=${page}`);
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