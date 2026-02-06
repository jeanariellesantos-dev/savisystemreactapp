import RequestStatusCards from "../../components/AdminDashboard/RequestStatusCards";
import RequestStatusChart from "../../components/AdminDashboard/RequestStatusChart";
import MostOrderedProductsChart from "../../components/AdminDashboard/MostOrderedProductsChart";
import MonthlyRequestsChart from "../../components/AdminDashboard/MonthlyRequestsChart";
import AvgApprovalTimeChart from "../../components/AdminDashboard/AvgApprovalTimeChart";
import SupplierLeadTimeChart from "../../components/AdminDashboard/SupplierLeadTimeChart";

import PageMeta from "../../components/common/PageMeta";

export default function Dashboard() {
  return (
    <>
      <PageMeta
        title="SAVI System"
        description="SAVI Submission and Approval system"
      />
      <div className="space-y-6">
        <RequestStatusCards />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <RequestStatusChart />
          <MostOrderedProductsChart />
        </div>

        <MonthlyRequestsChart />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AvgApprovalTimeChart />
          <SupplierLeadTimeChart />
        </div>
      </div>
      
    </>
  );
}
