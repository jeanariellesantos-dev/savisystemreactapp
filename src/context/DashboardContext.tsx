import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction 
} from "react";

import { DashboardService } from "../services/adminService";

export type Range = "7d" | "30d" | "year" | "custom";

interface DashboardContextType {
  range: Range;
  setRange: Dispatch<SetStateAction<Range>>;

  startDate: string | null;
  setStartDate: Dispatch<SetStateAction<string | null>>;

  endDate: string | null;
  setEndDate: Dispatch<SetStateAction<string | null>>;

  statusFigures: any;
  mostOrdered: any;
  monthlyRequests: any;
  avgApprovalTime: any;
  deliveryLeadTime: any;

  loading: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [range, setRange] = useState<Range>("30d");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [statusFigures, setStatusFigures] = useState<any>(null);
  const [mostOrdered, setMostOrdered] = useState<any>(null);
  const [monthlyRequests, setMonthlyRequests] = useState<any>(null);
  const [avgApprovalTime, setAvgApprovalTime] = useState<any>(null);
  const [deliveryLeadTime, setDeliveryLeadTime] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
    useEffect(() => {

    // wait until both dates exist for custom range
    if (range === "custom" && (!startDate || !endDate)) {
        return;
    }

    loadDashboard();
    }, [range, startDate, endDate]);

    async function loadDashboard() {
    setLoading(true);

    try {
        const params =
        range === "custom"
            ? {
                start_date: startDate,
                end_date: endDate,
            }
            : {
                range,
            };

        const [
        figures,
        products,
        monthly,
        approval,
        delivery,
        ] = await Promise.all([
        DashboardService.getStatusFigures(params),
        DashboardService.getMostOrderedProducts(params),
        DashboardService.getMonthlyRequests(params),
        DashboardService.getAvgApprovalTime(params),
        DashboardService.getDeliveryLeadTime(params),
        ]);

        setStatusFigures(figures);
        setMostOrdered(products);
        setMonthlyRequests(monthly);
        setAvgApprovalTime(approval);
        setDeliveryLeadTime(delivery);
    } finally {
        setLoading(false);
    }
    }

  return (
    <DashboardContext.Provider
      value={{
        range,
        setRange,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        statusFigures,
        mostOrdered,
        monthlyRequests,
        avgApprovalTime,
        deliveryLeadTime,
        loading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be inside DashboardProvider");
  return ctx;
}