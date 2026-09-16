"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "./CalendarView";
import { RecentActivity } from "./RecentActivity";
import { StatsCards } from "./StatsCard";
import { FilterBar } from "./FilterBar";
import { BookingsTable } from "./BookingTable";
import { BookingDetailsModal } from "./BookingDetailsModal";
import { useBookings } from "@/hooks/admin/useBooking";
import { useStats } from "@/hooks/admin/useState";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    bookings,
    loading: bookingsLoading,
    refetch,
  } = useBookings({
    search,
    status: statusFilter,
    type: typeFilter,
  });

  const { stats, loading: statsLoading } = useStats();

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const handleStatusChange = async (
    id: string,
    status: string,
    adminNote?: string,
  ) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to update booking status");
        return false;
      }

      const booking = await response.json().catch(() => null);

      if (status === "confirmed" || status === "cancelled") {
        try {
          await fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clientEmail: booking?.data?.clientEmail,
              clientName: booking?.data?.clientName,
              eventType: booking?.data?.eventType,
              eventDate: booking?.data?.eventDate,
              eventLocation: booking?.data?.eventLocation,
              status: booking?.data?.status,
              eventTime: booking?.data?.eventTime,
              adminNote: adminNote || "",
            }),
          });
          toast.success(
            status === "confirmed"
              ? "Booking confirmed and email sent"
              : "Booking cancelled",
          );
        } catch {
          toast.error("Booking updated, but the email notification failed");
        }
      } else {
        toast.success("Booking status updated");
      }

      refetch();
      return true;
    } catch {
      toast.error("An error occurred while updating the booking status");
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete booking");
        return;
      }

      // Success
      toast.success("Booking deleted successfully");
      refetch(); // Refresh the list
    } catch {
      toast.error("An error occurred while deleting");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your bookings, logistics, and event calendar.
        </p>
      </div>

      {/* Stats */}
      <StatsCards stats={stats} loading={statsLoading} />

      {/* Main Content */}
      <Tabs defaultValue="bookings" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bookings" className="space-y-4">
          <FilterBar
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            onExport={() => {
              // Implement CSV export
              toast("Export functionality coming soon");
            }}
          />
          <BookingsTable
            bookings={bookings}
            onView={handleViewBooking}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            loading={bookingsLoading}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView bookings={bookings} />
        </TabsContent>

        <TabsContent value="activity">
          <RecentActivity bookings={bookings} />
        </TabsContent>
      </Tabs>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
