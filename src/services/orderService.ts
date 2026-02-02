import URL_API from "../components/api/axios";


type CreateOrderItem = {  
    product_id: number;
    quantity: number;
};

type CreateOrderPayload = {
  status: string;
  items: CreateOrderItem[];
};

export const getPendingRequests = async () => {
   const response = await URL_API.get("/request/pending");

  return response.data;
};

export async function createOrder(payload: CreateOrderPayload) {
  const res = await URL_API.post("/request", payload);
  return res.data;
}