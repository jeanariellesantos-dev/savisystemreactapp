import { useState, useEffect } from "react";
import { Fragment } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/button/Button";
import { ReportService } from "../../services/reportService";
import { DealershipService } from "../../services/dealershipService";

export default function InventoryReportPage() {
  const { showToast } = useToast();

  const [data, setData] = useState<any[]>([]);
  const [filterType, setFilterType] = useState<"month" | "range">("month");
  const [dealerships, setDealerships] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    dealership_id: "",
    month: "",
    start_date: "",
    end_date: "",
    report_type: "SUMMARY",
  });

  const isInvalid =
  !filters.dealership_id ||
  (filterType === "month" && !filters.month) ||
  (filterType === "range" && (!filters.start_date || !filters.end_date));
  /* ================= FETCH ================= */
  const loadReport = async () => {
    try {
      setLoading(true);

      setData([]); // 🔥 IMPORTANT FIX
      const res = await ReportService.getInventoryReport(filters);

      if (res.data.type === "MONTHLY") {
        setData(res.data.data); // array of months
      } else {
        setData(res.data.data); // normal flat data
      }

    } catch {
      showToast("Failed to load report", "error");
    } finally {
      setLoading(false);
    }
  };

  const isMonthly = filters.report_type === "MONTHLY";

  const flatData = isMonthly
    ? data.flatMap((m: any) => m.data || [])
    : data || [];

  useEffect(() => {
    DealershipService.getAll().then(setDealerships);
  }, []);

  useEffect(() => {
  setData([]); // 🔥 prevents UI crash
}, [filters.report_type]);

useEffect(() => {
  if (dealerships?.length > 0) {
    setFilters((prev) => ({
      ...prev,
      dealership_id: String(dealerships[0].id),
    }));
  }
}, [dealerships]);

  /* ================= TOTALS ================= */

const totals = {
  ordered: flatData.reduce((s, i) => s + (i.ordered || 0), 0),
  delivered: flatData.reduce((s, i) => s + (i.delivered || 0), 0),
  adjustment: flatData.reduce((s, i) => s + (i.adjustment || 0), 0),
  balance: flatData.reduce((s, i) => s + (i.ending || 0), 0),
};

  /* ================= UI ================= */
  return (
    <div className="rounded-2xl border bg-white p-4 dark:bg-gray-900 dark:border-gray-800">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Inventory Report
          </h3>
          <p className="text-xs text-gray-500">
            Per dealership stock movement summary
          </p>
        </div>

      </div>

{/* ================= FILTERS ================= */}

<div className="mb-4 rounded-2xl border bg-gray-50/70 dark:bg-gray-800/50 p-4 space-y-4">

  {/* HEADER */}
  <div>
    <h4 className="text-sm font-semibold text-gray-700 dark:text-white">
      Filters
    </h4>
    <p className="text-xs text-gray-500">
      Select dealership and reporting period
    </p>
  </div>

  {/* GRID */}
  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">

    {/* DEALERSHIP */}
    <div className="sm:col-span-4">
      <Label>Dealership</Label>
      <Select
        value={filters.dealership_id}
        placeholder="Select dealership..."
        options={dealerships.map((d) => ({
          value: String(d.id),
          label: d.dealership_name,
        }))}
        onChange={(value) =>
          setFilters({ ...filters, dealership_id: value })
        }
      />
    </div>

    {/* FILTER TYPE */}
    <div className="sm:col-span-3">
      <Label>Report Type</Label>
      <div className="flex rounded-lg border overflow-hidden">
        <button
          className={`flex-1 py-2 text-xs h-[43px] font-medium transition ${
            filterType === "month"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-900 dark:text-gray-400"
          }`}
          onClick={() => {
            setFilterType("month");
              setFilters({
                ...filters,
                report_type: "SUMMARY", // ✅ monthly input = summary
                start_date: "",
                end_date: "",
              });
          }}
        >
          Monthly
        </button>

        <button
          className={`flex-1 py-2 text-xs font-medium transition ${
            filterType === "range"
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-gray-900 dark:text-gray-400"
          }`}
            onClick={() => {
              setFilterType("range");
              setFilters({
                ...filters,
                report_type: "MONTHLY", // ✅ range = monthly breakdown
                month: "",
              });
            }}
        >
          Range
        </button>
      </div>
    </div>

    {/* MONTH */}
    {filterType === "month" && (
      <div className="sm:col-span-3">
        <Label>Month</Label>
        <Input
          type="month"
          value={filters.month}
          onChange={(e) =>
            setFilters({ ...filters, month: e.target.value })
          }
        />
      </div>
    )}

    {/* DATE RANGE */}
    {filterType === "range" && (
      <div className="sm:col-span-5">
        <Label>Date Range</Label>

        <div className="flex items-center gap-2">

          <Input
            type="date"
            value={filters.start_date}
            onChange={(e) =>
              setFilters({ ...filters, start_date: e.target.value })
            }
          />

          <span className="text-gray-400 text-xs">to</span>

          <Input
            type="date"
            value={filters.end_date}
            onChange={(e) =>
              setFilters({ ...filters, end_date: e.target.value })
            }
          />
        </div>
      </div>
    )}

{/* ACTIONS */}
<div className="sm:col-span-12 flex flex-col sm:flex-row justify-between gap-3 pt-2 border-t">

  {/* LEFT SIDE (PRIMARY ACTIONS) */}
  <div className="flex gap-2 w-full sm:w-auto">

    <Button
      disabled={isInvalid || loading}
      onClick={loadReport}
      className="w-full sm:w-auto"
    >
      {loading ? "Generating..." : "📊 Generate"}
    </Button>

    <Button
      variant="outline"
      onClick={() =>
        setFilters({
          dealership_id: "",
          month: "",
          start_date: "",
          end_date: "",
          report_type: "SUMMARY",
        })
      }
    >
      Reset
    </Button>
  </div>

  {/* RIGHT SIDE (EXPORT ACTIONS) */}
  <div className="flex gap-2 w-full sm:w-auto">

    <Button
      variant="outline"
      disabled={isInvalid || loading || data.length === 0}
      onClick={async () => {
        const res = await ReportService.exportInventoryExcel(filters);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `Inventory_Report_${Date.now()}.xlsx`;
        link.click();
      }}
    >
      📥 Excel
    </Button>

    <Button
      variant="outline"
      disabled={isInvalid || loading || data.length === 0}
      onClick={async () => {
        const res = await ReportService.exportInventoryPdf(filters);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = `Inventory_Report_${Date.now()}.pdf`;
        link.click();
      }}
    >
      🧾 PDF
    </Button>

  </div>

</div>

  </div>
</div>

      {/* ================= KPI CARDS ================= */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">

        <div className="rounded-xl border p-3 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500">Total Ordered</p>
          <h4 className="text-lg font-semibold">{totals.ordered}</h4>
        </div>

        <div className="rounded-xl border p-3 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500">Total Delivered</p>
          <h4 className="text-lg font-semibold">{totals.delivered}</h4>
        </div>

        <div className="rounded-xl border p-3 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500">Total Balance</p>
          <h4 className="text-lg font-semibold">{totals.balance}</h4>
        </div>
      </div> */}

      {/* ================= TABLE ================= */}
<div className="border rounded-xl overflow-hidden">

  {/* SCROLLABLE TABLE */}
  <div className="max-h-[400px] overflow-auto">

    <table className="w-full">

      {/* HEADER */}
      <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <tr>
          <th className="py-3 px-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
            Category
          </th>
          <th className="py-3 px-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
            Products
          </th>
          <th className="py-3 px-3 text-left text-theme-xs font-medium text-gray-500 dark:text-gray-400">
            Unit
          </th>
          <th className="py-3 px-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">
            Ordered
          </th>
          <th className="py-3 px-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">
            Delivered
          </th>
          <th className="py-3 px-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">
            Adjustment
          </th>
          <th className="py-3 px-3 text-right text-theme-xs font-medium text-gray-500 dark:text-gray-400">
            Ending
          </th>
        </tr>
      </thead>

      {/* BODY */}
<tbody className="divide-y divide-gray-100 dark:divide-gray-800">

  {loading ? (
    <tr>
      <td colSpan={7} className="py-6 text-center text-gray-500">
        Loading report...
      </td>
    </tr>

  ) : !data || data.length === 0 ? (
    <tr>
      <td colSpan={7} className="py-6 text-theme-xs text-center text-gray-500">
        No data found
      </td>
    </tr>

  ) : Array.isArray(data) && data[0]?.data ? (

    data.map((monthData: any, idx: number) => (
      <Fragment key={idx}>

        {/* 🔹 MONTH HEADER */}
      <tr>
        <td colSpan={7} className="px-3 py-2 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-theme-s font-semibold text-gray-700 dark:text-white">
              {monthData?.month}
            </span>
            {/* <span className="text-xs text-gray-400">
              {(monthData?.data || []).length} items
            </span> */}
          </div>
        </td>
      </tr>

      {(monthData?.data || []).map((item: any, i: number) => (
        <tr
          key={`${idx}-${i}`}
          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
        >
          <td className="py-2 px-3 text-theme-xs text-gray-600 dark:text-gray-300">
            {item.category}
          </td>
          <td className="py-2 px-3 text-theme-xs font-medium text-gray-800 dark:text-white">
            {item.product}
          </td>
          <td className="py-2 px-3 text-theme-xs text-gray-500">{item.unit}</td>

          <td className="py-2 px-3 text-theme-xs text-right text-gray-700">
            {item.ordered}
          </td>

          <td className="py-2 px-3 text-theme-xs text-right text-blue-600">
            {item.delivered}
          </td>

          <td className="py-2 px-3 text-theme-xs text-right text-yellow-600">
            {item.adjustment}
          </td>

          <td className="py-2 px-3 text-theme-xs text-right font-semibold text-gray-900 dark:text-white">
            {item.ending}
          </td>
        </tr>
      ))}

      </Fragment>
    ))

  ) : (

    data.map((item: any, i: number) => (
      <tr
        key={i}
        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
      >
        <td className="py-2 px-3 text-theme-xs text-gray-600 dark:text-gray-300">
          {item.category}
        </td>

        <td className="py-2 px-3 text-theme-xs font-medium text-gray-800 dark:text-white">
          {item.product}
        </td>

        <td className="py-2 px-3 text-theme-xs text-gray-500">
          {item.unit}
        </td>

        <td className="py-2 px-3 text-theme-xs text-right text-gray-700">
          {item.ordered}
        </td>

        <td className="py-2 px-3 text-theme-xs text-right text-blue-600">
          {item.delivered}
        </td>

        <td className="py-2 px-3 text-theme-xs text-right text-yellow-600">
          {item.adjustment}
        </td>

        <td className="py-2 px-3 text-theme-xs text-right font-semibold text-gray-900 dark:text-white">
          {item.ending}
        </td>
      </tr>
    ))

  )}

</tbody>
    </table>
  </div>
</div>
    </div>
  );
}