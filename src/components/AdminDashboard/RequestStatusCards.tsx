// components/AdminDashboard/RequestStatusCards.tsx
export default function RequestStatusCards() {
  const stats = [
    { label: "Approved", value: 128, color: "text-green-600" },
    { label: "Rejected", value: 24, color: "text-red-600" },
    { label: "Shipped", value: 89, color: "text-blue-600" },
    { label: "Received", value: 73, color: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
