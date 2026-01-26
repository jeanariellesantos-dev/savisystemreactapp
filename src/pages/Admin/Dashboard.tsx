import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import RecentRequests from "../../components/ecommerce/RecentRequests";

export default function Dashboard() {
  return (
    <>
      <PageMeta
        title="SAVI system"
        description="SAVI system"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12  space-y-6 xl:col-span-12">
          <RecentRequests />
        </div>
      </div>
    </>
  );
}
