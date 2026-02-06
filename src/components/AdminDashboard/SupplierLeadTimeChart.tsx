import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function SupplierLeadTimeChart() {
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
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        "Supplier A",
        "Supplier B",
        "Supplier C",
        "Supplier D",
      ],
    },
    yaxis: {
      title: {
        text: "Days",
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} days`,
      },
    },
  };

  const series = [
    {
      name: "Lead Time",
      data: [5, 9, 7, 12], // days
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
        Supplier Lead Time
      </h3>

      <Chart options={options} series={series} type="bar" height={260} />
    </div>
  );
}
