import RequestStatusCards from "../../components/AdminDashboard/RequestStatusCards";
import RequestStatusChart from "../../components/AdminDashboard/RequestStatusChart";
import MostOrderedProductsChart from "../../components/AdminDashboard/MostOrderedProductsChart";
import MonthlyRequestsChart from "../../components/AdminDashboard/MonthlyRequestsChart";
import AvgApprovalTimeChart from "../../components/AdminDashboard/AvgApprovalTimeChart";
import DeliveryLeadTimeChart from "../../components/AdminDashboard/DeliveryLeadTimeChart";
import { useDashboard, DashboardProvider } from "../../context/DashboardContext";
import DashboardDateFilter from "../../components/common/DashboardDateFilter";

import PageMeta from "../../components/common/PageMeta";

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
}

function DashboardContent() {

  return (
    <>

      <PageMeta
        title="SAVI System"
        description="SAVI Submission and Approval system"
      />

      {/* GLOBAL FILTER */}
      <div className="flex justify-end mb-6">
         <DashboardDateFilter />
      </div>

      <div className="space-y-6">
        <RequestStatusCards />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RequestStatusChart />
          <MostOrderedProductsChart />
        </div>

        <MonthlyRequestsChart />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AvgApprovalTimeChart />
          <DeliveryLeadTimeChart />
        </div>
      </div>
    </>
  );
}

