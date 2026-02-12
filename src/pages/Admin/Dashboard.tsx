import RequestStatusCards from "../../components/admindashboard/RequestStatusCards";
import RequestStatusChart from "../../components/admindashboard/RequestStatusChart";
import MostOrderedProductsChart from "../../components/admindashboard/MostOrderedProductsChart";
import MonthlyRequestsChart from "../../components/admindashboard/MonthlyRequestsChart";
import AvgApprovalTimeChart from "../../components/admindashboard/AvgApprovalTimeChart";
import SupplierLeadTimeChart from "../../components/admindashboard/SupplierLeadTimeChart";

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
