import { useEffect, useState } from "react";
import { getRequests } from "../services/orderService";
import { RequestService } from "../services/adminService";
import { Request } from "../types/request";

export function useRequests(
  filter: "ACTIVE" | "ALL",
  page: number,
  isAdmin = false
){
  const [requests, setRequests] = useState<Request[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = isAdmin
        ? await RequestService.getAll({
            filter,
            page,
          })
        : await getRequests(filter, page);

      const data = isAdmin ? res : res.data;

      setRequests(data.data);
      setMeta(data);

      console.log("API page:", data.current_page);
      console.log("Rows:", data.data.length);
    } catch (err) {
      console.error(err);
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter, page, isAdmin]);

  return {
    requests,
    meta,
    loading,
    error,
    refreshRequests: fetchRequests,
  };
}