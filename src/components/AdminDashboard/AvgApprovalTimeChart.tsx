import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function AvgApprovalTimeChart() {
  const options: ApexOptions = {
    chart: {
      type: "line",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
    },
    colors: ["#f59e0b"],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    yaxis: {
      title: {
        text: "Hours",
      },
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} hrs`,
      },
    },
  };

  const series = [
    {
      name: "Avg Approval Time",
      data: [14, 11, 16, 9, 8, 10], // hours
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Average Approval Time
      </h3>

      <Chart options={options} series={series} type="line" height={260} />
    </div>
  );
}
