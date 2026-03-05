import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../context/DashboardContext";

export default function MonthlyRequestsChart() {
  const { monthlyRequests, loading } = useDashboard();

  if (loading || !monthlyRequests) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        Loading chart...
      </div>
    );
  }

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
      categories: monthlyRequests.categories,
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
      },
    },

    grid: {
      borderColor: "#f1f5f9",
      yaxis: { lines: { show: true } },
    },

    tooltip: {
      theme: "light",
    },
  };

  const series = [
    {
      name: "Requests",
      data: monthlyRequests.series,
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