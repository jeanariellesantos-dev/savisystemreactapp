import { useEffect, useState } from "react";
import { getRequests } from "../services/orderService";
import { Request } from "../types/request";

export function useRequests(filter: string, page: number) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await getRequests(filter, page);

      // IMPORTANT
      setRequests(res.data.data);   // records array
      setMeta(res.data);            // pagination info

         console.log("API page:", res.data.current_page);
      console.log("Rows:", res.data.data.length);
    } catch (err) {
      setError("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filter, page]);

  return { requests, meta, loading, error, refreshRequests: fetchRequests };
}

