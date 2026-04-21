import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";

function CalendarChevron({ className, disabled, orientation = "left", size = 18, ...props }) {
  const rotation =
    orientation === "left"
      ? "rotate-180"
      : orientation === "up"
      ? "-rotate-90"
      : orientation === "down"
      ? "rotate-90"
      : "rotate-0";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "text-white/80 transition-opacity",
        rotation,
        disabled ? "opacity-30" : "opacity-90",
        className
      )}
      {...props}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function Calendar({ className, classNames, showOutsideDays = true, ...props }) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2", className)}
      classNames={{
        months: "flex flex-col gap-4",
        month: "space-y-3",
        caption: "relative flex items-center justify-center",
        caption_label: "text-sm font-black tracking-tight text-white",
        nav: "flex items-center gap-2",
        nav_button: "h-8 w-8 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "w-10 text-[11px] font-black text-white/40",
        row: "flex w-full mt-1",
        cell: "relative h-10 w-10 text-center",
        day: "h-10 w-10 rounded-xl text-sm font-bold text-white/80 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
        day_selected: "bg-amber-500 text-black hover:bg-amber-500",
        day_today: "border border-amber-400/60 text-white",
        day_outside: "text-white/20",
        day_disabled: "text-white/20",
        day_range_middle: "bg-white/5",
        day_range_start: "bg-amber-500 text-black",
        day_range_end: "bg-amber-500 text-black",
        ...classNames
      }}
      components={{
        Chevron: CalendarChevron
      }}
      {...props}
    />
  );
}

export { Calendar };
