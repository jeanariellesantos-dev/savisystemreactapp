import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useState, useEffect } from "react";

export default function EcommerceMetrics() {

  // Use a state variable to store the current date string
  // It's initialized immediately when the component mounts
  const [currentDate, setCurrentDate] = useState(new Date());

  // Use useEffect to update the date if needed (e.g., if you want it to update
  // over a long period, though for just "today's" date, this isn't strictly necessary)
  useEffect(() => {
    // This effect runs once when the component mounts
    // For a simple static date display, this state management is enough.
  }, []);

  // Format the date for the "Day of Week" (e.g., "Monday")
  const dayOfWeek = currentDate.toLocaleDateString(undefined, { weekday: 'long' });

  // Format the date in "Text Format" (e.g., "January 20, 2026")
  // Using 'en-US' locale for consistent English formatting,
  // 'undefined' would use the user's browser default locale.
  const textFormatDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
      {/* <!-- Metric Item Start --> */}

      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      {/* <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Orders
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              5,359
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div> */}
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
