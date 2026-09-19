"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface Booking {
  _id: string;
  eventDate: string;
  status: "pending" | "confirmed" | "cancelled";
  clientName: string;
  eventType: string;
}

interface CalendarViewProps {
  bookings: Booking[];
}

export function CalendarView({ bookings }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Full month grid with padding days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const bookingsByDate = bookings.reduce<Record<string, Booking[]>>(
    (acc, booking) => {
      const dateKey = format(new Date(booking.eventDate), "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(booking);
      return acc;
    },
    {},
  );

  const selectedDateBookings = selectedDate
    ? bookingsByDate[format(selectedDate, "yyyy-MM-dd")] || []
    : [];

  const goToPrev = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const goToNext = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
      {/* Calendar */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h3 className="heading-card">{format(currentDate, "MMMM yyyy")}</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToPrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const dayBookings = bookingsByDate[dateKey] || [];
              const hasBookings = dayBookings.length > 0;
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);

              const hasConfirmed = dayBookings.some(
                (b) => b.status === "confirmed",
              );
              const hasPending = dayBookings.some(
                (b) => b.status === "pending",
              );

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative aspect-square flex flex-col items-center justify-center rounded-lg transition-colors text-sm",
                    !isCurrentMonth && "text-muted-foreground/40",
                    isSelected && "bg-primary text-primary-foreground",
                    !isSelected && isToday && "bg-primary/10 font-semibold",
                    !isSelected && !isToday && "hover:bg-accent",
                  )}
                >
                  <span>{format(day, "d")}</span>
                  {hasBookings && (
                    <div className="absolute bottom-1.5 flex items-center gap-0.5">
                      {hasConfirmed && (
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isSelected
                              ? "bg-primary-foreground"
                              : "bg-emerald-500",
                          )}
                        />
                      )}
                      {hasPending && (
                        <span
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isSelected
                              ? "bg-primary-foreground"
                              : "bg-amber-500",
                          )}
                        />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar — bookings for selected date */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="border-b bg-muted/30 p-4">
          <h4 className="heading-card">
            {selectedDate
              ? format(selectedDate, "EEEE, MMM d, yyyy")
              : "Select a date"}
          </h4>
          {selectedDate && selectedDateBookings.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {selectedDateBookings.length}{" "}
              {selectedDateBookings.length === 1 ? "booking" : "bookings"}
            </p>
          )}
        </div>

        <div className="p-4">
          {!selectedDate ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Click a date to view bookings
            </p>
          ) : selectedDateBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No bookings on this day
            </p>
          ) : (
            <div className="stack-sm">
              {selectedDateBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-lg border bg-muted/20 p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {booking.clientName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {booking.eventType}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
