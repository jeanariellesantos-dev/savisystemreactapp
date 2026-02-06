// components/AdminDashboard/RequestStatusChart.tsx
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function RequestStatusChart() {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },
    labels: ["Approved", "Rejected", "Shipped", "Received"],
    colors: ["#22c55e", "#ef4444", "#3b82f6", "#a855f7"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
  };

  const series = [128, 24, 89, 73];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Request Status Breakdown
      </h3>
      <Chart options={options} series={series} type="donut" height={260} />
    </div>
  );
}
