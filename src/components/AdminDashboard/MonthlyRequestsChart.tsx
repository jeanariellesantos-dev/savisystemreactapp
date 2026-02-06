// components/AdminDashboard/MonthlyRequestsChart.tsx
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MonthlyRequestsChart() {
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
  };

  const series = [
    {
      name: "Requests",
      data: [45, 62, 78, 55, 89, 102],
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Monthly Requests
      </h3>
      <Chart options={options} series={series} type="bar" height={220} />
    </div>
  );
}
