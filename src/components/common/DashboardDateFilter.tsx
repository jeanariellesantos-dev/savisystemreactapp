import { useDashboard } from "../../context/DashboardContext";
import type { Range } from "../../context/DashboardContext";

export default function DashboardDateFilter() {
  const {
    range,
    setRange,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useDashboard();

  const isRange = (value: string): value is Range => {
    return ["7d", "30d", "year", "custom"].includes(value);
  };

  const isCustom = range === "custom";

  return (
    <div className="flex items-center gap-2">
      <select
        value={range}
        onChange={(e) => {
          const value = e.target.value;
          if (isRange(value)) setRange(value);

          if (value !== "custom") {
            setStartDate(null);
            setEndDate(null);
}
        }}
        className="rounded-lg border px-3 py-2 text-sm dark:bg-gray-900 dark:text-white/90"
      >
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="year">This Year</option>
        <option value="custom">Custom Range</option>
      </select>

      {isCustom && (
        <>
          <input
            type="date"
            value={startDate ?? ""}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border px-2 py-2 text-sm"
          />

          <input
            type="date"
            value={endDate ?? ""}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border px-2 py-2 text-sm"
          />
        </>
      )}
    </div>
  );
}