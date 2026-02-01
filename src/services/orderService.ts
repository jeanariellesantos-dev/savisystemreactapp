import URL_API from "../components/api/axios";

export const getPendingRequests = async () => {
   const response = await URL_API.get("/request/pending");

  return response.data;
};