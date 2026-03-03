import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../context/DashboardContext";

export default function RequestStatusChart() {
  const { statusFigures, loading } = useDashboard();

  if (loading || !statusFigures) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        Loading chart...
      </div>
    );
  }

  const options: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
    },

    labels: ["Pending", "Approved", "Rejected", "Shipped", "Received"],

    colors: [
      "#f59e0b",
      "#22c55e",
      "#ef4444",
      "#3b82f6",
      "#a855f7",
    ],

    legend: {
      position: "bottom",
      labels: { colors: "#6b7280" },
      itemMargin: { horizontal: 12 },
      onItemHover: { highlightDataSeries: true },
    },

    dataLabels: { enabled: false },

    states: {
      hover: { filter: { type: "lighten", value: 0.15 } as any },
      active: { filter: { type: "darken", value: 0.25 } as any },
    },

    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () =>
                (
                  statusFigures.pending +
                  statusFigures.approved +
                  statusFigures.rejected +
                  statusFigures.shipped +
                  statusFigures.received
                ).toString(),
            },
          },
        },
      },
    },

    tooltip: { theme: "light" },
  };

  const series = [
    statusFigures.pending,
    statusFigures.approved,
    statusFigures.rejected,
    statusFigures.shipped,
    statusFigures.received,
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Request Status Breakdown
      </h3>

      <Chart options={options} series={series} type="donut" height={260} />
    </div>
  );
}