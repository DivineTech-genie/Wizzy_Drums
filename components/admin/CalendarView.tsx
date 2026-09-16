"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  //   isSameMonth,
  isSameDay,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";

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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const bookingsByDate = bookings.reduce((acc: any, booking) => {
    const dateKey = format(new Date(booking.eventDate), "yyyy-MM-dd");
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(booking);
    return acc;
  }, {});

  const selectedDateBookings = selectedDate
    ? bookingsByDate[format(selectedDate, "yyyy-MM-dd")] || []
    : [];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 1,
                    1,
                  ),
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentDate(
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() + 1,
                    1,
                  ),
                )
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
          {days.map((day) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const hasBookings = bookingsByDate[dateKey]?.length > 0;
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <button
                key={dateKey}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-lg transition-colors relative",
                  isSelected && "bg-primary text-primary-foreground",
                  !isSelected && isToday && "bg-primary/10",
                  !isSelected && !isToday && "hover:bg-accent",
                )}
              >
                <span className="text-sm">{format(day, "d")}</span>
                {hasBookings && (
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full absolute bottom-1.5",
                      isSelected ? "bg-primary-foreground" : "bg-primary",
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sidebar - Bookings for selected date */}
      <div>
        <h4 className="font-medium mb-3">
          {selectedDate ? format(selectedDate, "EEEE, MMM d") : "Select a date"}
        </h4>
        {selectedDateBookings.length > 0 ? (
          <div className="space-y-3">
            {selectedDateBookings.map((booking: Booking) => (
              <Card key={booking._id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{booking.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.eventType}
                    </p>
                  </div>
                  <StatusBadge status={booking.status} />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          selectedDate && (
            <p className="text-sm text-muted-foreground">
              No bookings on this day
            </p>
          )
        )}
      </div>
    </div>
  );
}
