// components/AdminDashboard/MostOrderedProductsChart.tsx
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function MostOrderedProductsChart() {
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
      },
    },
    colors: ["#465fff"],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "Bond Paper",
        "Printer Ink",
        "Stapler",
        "USB Flash Drive",
        "Folder",
      ],
    },
  };

  const series = [
    {
      name: "Orders",
      data: [120, 95, 82, 65, 49],
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
