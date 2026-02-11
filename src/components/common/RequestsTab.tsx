import { useState, useEffect } from "react";

type Filter = "ACTIVE" | "ALL";

const RequestsTab: React.FC<{
  value: Filter;
  onChange?: (filter: Filter) => void;
}> = ({ value, onChange }) => {

  const getButtonClass = (option: Filter) =>
    value === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => onChange?.("ACTIVE")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("ACTIVE")}`}
      >
        Active
      </button>

      <button
        onClick={() => onChange?.("ALL")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass("ALL")}`}
      >
        All
      </button>
    </div>
  );
};

export default RequestsTab;

