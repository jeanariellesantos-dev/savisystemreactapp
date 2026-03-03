import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../context/DashboardContext";

export default function AvgApprovalTimeChart() {
  const { avgApprovalTime, loading } = useDashboard();

  if (loading || !avgApprovalTime) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        Loading chart...
      </div>
    );
  }

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
      strokeWidth: 0,
    },

    colors: ["#f59e0b"],

    xaxis: {
      categories: avgApprovalTime.categories,
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
      },
    },

    yaxis: {
      title: {
        text: "Hours",
      },
      labels: {
        formatter: (val) => `${val}h`,
      },
    },

    grid: {
      borderColor: "#f1f5f9",
      yaxis: { lines: { show: true } },
    },

    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) => `${val} hrs`,
      },
    },
  };

  const series = [
    {
      name: "Avg Approval Time",
      data: avgApprovalTime.series,
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