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

    labels: [
      "Pending",
      "Approved",
      "Shipped",
      "Received",
      "Rejected",
      "On Hold",
      "Cancelled",
    ],

    colors: [
      "#f59e0b", // Pending
      "#22c55e", // Approved
      "#3b82f6", // Shipped
      "#a855f7", // Received
      "#ef4444", // Rejected
      "#eab308", // On Hold
      "#6b7280", // Cancelled
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
                  statusFigures.shipped +
                  statusFigures.received +
                  statusFigures.rejected +
                  statusFigures.on_hold +
                  statusFigures.cancelled
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
    statusFigures.shipped,
    statusFigures.received,
    statusFigures.rejected,
    statusFigures.on_hold,
    statusFigures.cancelled,
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