"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BoldCalendarProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  bookedDates?: Date[];
  minDate?: Date;
}

export function BoldCalendar({
  selectedDate,
  onSelectDate,
  bookedDates = [],
  minDate = new Date(),
}: BoldCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get days in month with proper grid positioning
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const isDateBooked = (date: Date) => {
    return bookedDates.some((booked) => isSameDay(booked, date));
  };

  const isDateDisabled = (date: Date) => {
    return date < minDate || isDateBooked(date);
  };

  const handleDateClick = (date: Date) => {
    if (!isDateDisabled(date)) {
      onSelectDate(date);
    }
  };

  // Weekday headers
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="w-full max-w-md mx-auto bg-card rounded-2xl border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-primary/5">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMonth}
            className="h-9 w-9 rounded-full hover:bg-primary/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span className="font-heading text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMonth}
            className="h-9 w-9 rounded-full hover:bg-primary/10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate
              ? isSameDay(day, selectedDate)
              : false;
            const isBooked = isDateBooked(day);
            const isDisabled = isDateDisabled(day);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={day.toString()}
                onClick={() => handleDateClick(day)}
                disabled={isDisabled}
                className={cn(
                  "relative h-12 rounded-xl text-sm font-medium transition-all duration-200",
                  "hover:scale-105 hover:shadow-md",
                  !isCurrentMonth && "text-muted-foreground/40",
                  isCurrentMonth && !isDisabled && "hover:bg-primary/10",
                  isSelected &&
                    "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105",
                  isBooked &&
                    isCurrentMonth &&
                    "bg-red-500/10 text-red-500 line-through cursor-not-allowed",
                  isDisabled && !isBooked && "opacity-40 cursor-not-allowed",
                  isCurrentDay && !isSelected && "border-2 border-primary/30",
                  isCurrentMonth &&
                    !isDisabled &&
                    !isSelected &&
                    "hover:bg-muted",
                )}
              >
                {format(day, "d")}
                {/* Booked indicator dot */}
                {isBooked && isCurrentMonth && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
                {/* Selected indicator */}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary-foreground/20 text-[8px] flex items-center justify-center">
                    ✓
                  </span>
                )}
                {/* Today dot */}
                {isCurrentDay && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted border border-muted-foreground/20" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-primary/30 bg-transparent" />
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
