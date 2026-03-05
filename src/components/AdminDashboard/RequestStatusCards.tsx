import { useDashboard } from "../../context/DashboardContext";

export default function RequestStatusCards() {
  const { statusFigures, loading } = useDashboard();

  if (loading || !statusFigures) return null;

  const stats = [
    {
      label: "Pending",
      value: statusFigures.pending,
      color: "text-amber-500",
    },
    {
      label: "Approved",
      value: statusFigures.approved,
      color: "text-green-600",
    },
    {
      label: "Rejected",
      value: statusFigures.rejected,
      color: "text-red-600",
    },
    {
      label: "Shipped",
      value: statusFigures.shipped,
      color: "text-blue-600",
    },
    {
      label: "Received",
      value: statusFigures.received,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {s.label}
          </p>

          <p className={`mt-2 text-2xl font-semibold ${s.color}`}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}