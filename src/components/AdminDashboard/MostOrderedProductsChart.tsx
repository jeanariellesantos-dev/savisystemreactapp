import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../context/DashboardContext";

export default function MostOrderedProductsChart() {
  const { mostOrdered, loading } = useDashboard();

  if (loading || !mostOrdered) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        Loading chart...
      </div>
    );
  }

  const options: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },

    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "55%",
      },
    },

    colors: ["#465fff"],

    dataLabels: {
      enabled: false,
    },

    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      xaxis: {
        lines: { show: true },
      },
      yaxis: {
        lines: { show: false },
      },
    },

    xaxis: {
      categories: mostOrdered.categories,
      labels: {
        style: {
          colors: "#6b7280",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      labels: {
        style: {
          colors: "#374151",
          fontSize: "13px",
          fontWeight: 500,
        },
      },
    },

    tooltip: {
      theme: "light",
      y: {
        formatter: (val: number) => `${val} orders`,
      },
    },
  };

  const series = [
    {
      name: "Orders",
      data: mostOrdered.series,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Most Ordered Products
      </h3>

      <Chart options={options} series={series} type="bar" height={260} />
    </div>
  );
}