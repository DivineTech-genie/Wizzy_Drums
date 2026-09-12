"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IBooking } from "@/app/backend/models/booking.model";

export type Booking = Omit<
  IBooking,
  "_id" | "eventDate" | "createdAt" | "updatedAt"
> & {
  _id: string;
  eventDate: string;
  createdAt: string;
  updatedAt: string;
};

interface UseBookingsParams {
  search?: string;
  status?: string;
  type?: string;
}

export function useBookings(params: UseBookingsParams = {}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append("search", params.search);
      if (params.status && params.status !== "all")
        queryParams.append("status", params.status);
      if (params.type && params.type !== "all")
        queryParams.append("type", params.type);

      const response = await fetch(
        `/api/admin/bookings?${queryParams.toString()}`,
      );

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [params.search, params.status, params.type, router]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
}
