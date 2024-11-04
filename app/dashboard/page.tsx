"use client";

import { addDays, format } from "date-fns";
import { CalendarDateRangePicker } from "./components/date-range-picker";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { getHabitsLog } from "./action";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const handleDateRangeChange = async (newDateRange: DateRange | undefined) => {
    if (newDateRange) {
      const fromString = newDateRange.from
        ? format(newDateRange.from, "yyyy-MM-dd")
        : "";
      const toString = newDateRange.to
        ? format(newDateRange.to, "yyyy-MM-dd")
        : "";
      //todo delete this line
      console.log("Date range changed:", { from: fromString, to: toString });

      const habitsLog = await getHabitsLog(fromString, toString);
      console.log("Habits Log: ", habitsLog);
    }
  };

  useEffect(() => {
    handleDateRangeChange(dateRange);
  }, [dateRange]);

  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
          </div>
        </div>
      </div>
    </div>
  );
}
