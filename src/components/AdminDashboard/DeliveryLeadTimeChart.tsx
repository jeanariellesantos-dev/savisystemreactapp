import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDashboard } from "../../context/DashboardContext";

export default function DeliveryLeadTimeChart() {
  const { deliveryLeadTime, loading } = useDashboard();

  if (loading || !deliveryLeadTime) {
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
        borderRadius: 6,
        columnWidth: "45%",
      },
    },

    colors: ["#3b82f6"],

    dataLabels: { enabled: false },

    xaxis: {
      categories: deliveryLeadTime.categories,
    },

    yaxis: {
      title: {
        text: "Days",
      },
    },

    tooltip: {
      y: {
        formatter: (val: number) => `${val} days`,
      },
    },
  };

  const series = [
    {
      name: "Delivery Lead Time",
      data: deliveryLeadTime.series,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Delivery Lead Time
      </h3>

      <Chart options={options} series={series} type="bar" height={260} />
    </div>
  );
}