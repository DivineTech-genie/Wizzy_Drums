"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookingsTable } from "@/components/admin/BookingTable";
import { FilterBar } from "@/components/admin/FilterBar";
import { useBookings } from "@/hooks/admin/useBooking";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AllBookingsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const { bookings, loading, refetch } = useBookings({
    search,
    status: statusFilter,
    type: typeFilter,
  });

  const handleViewBooking = (booking: { _id: string }) => {
    router.push(`/admin/bookings/${booking._id}`);
  };

  // ✅ Return boolean so BookingDetailsModal can react
  const handleStatusChange = async (
    id: string,
    status: "pending" | "confirmed" | "cancelled",
  ): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Booking ${status}`);
        refetch();
        return true;
      } else {
        toast.error("Failed to update status");
        return false;
      }
    } catch {
      toast.error("Failed to update status");
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Booking deleted");
        refetch();
      } else {
        toast.error("Failed to delete booking");
      }
    } catch {
      toast.error("Failed to delete booking");
    }
  };

  return (
    <div className="stack-md">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-sm">All Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Manage every booking request, confirm, or cancel them
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/admin")}
          className="gap-2 self-start sm:self-auto"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        onExport={() => toast("Export functionality coming soon")}
      />

      {/* Table */}
      <BookingsTable
        bookings={bookings}
        onView={handleViewBooking}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
