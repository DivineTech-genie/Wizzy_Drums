"use client";

import { useEffect, useState } from "react";
import { BookingFormData } from "./BookingForm";

interface AdminDashboardProps extends BookingFormData {
  _id: string;
  status: "pending" | "confirmed" | "cancelled";
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<AdminDashboardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bookings");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch bookings.");
      }

      setBookings(result.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // Only fetch if the component is actually still mounted
      if (isMounted) {
        await fetchBookings();
      }
    };

    loadData();

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks or state updates on unmounted components
    };
  }, []);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "confirmed" | "cancelled",
  ) => {
    setActionLoadingId(id);
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update status.");
      }

      // Update local state instantly so the UI updates without a full page reload
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id.toString() === id
            ? ({ ...booking, status: newStatus } as AdminDashboardProps)
            : booking,
        ),
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 3. DELETE: Remove booking entirely
  const handleDeleteBooking = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this booking request?",
      )
    ) {
      return;
    }

    setActionLoadingId(id);
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete booking.");
      }

      // Filter out the deleted booking from our local state array
      setBookings((prev) =>
        prev.filter((booking) => booking._id.toString() !== id),
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-5 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Drummer Admin Command Center
            </h1>
            <p className="text-sm text-gray-500">
              Manage incoming gig requests, flights, and status flows
            </p>
          </div>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh Data
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            Loading upcoming requests...
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded text-center">
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
            No booking requests found in the system yet.
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Client Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Location / Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking: AdminDashboardProps) => (
                  <tr
                    key={booking._id.toString()}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {booking.clientName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.clientEmail}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.clientPhone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.eventDate).toLocaleDateString(
                          undefined,
                          {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {booking.eventTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {booking.eventType}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {booking.eventLocation}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            disabled={actionLoadingId !== null}
                            onClick={() =>
                              handleUpdateStatus(
                                booking._id.toString(),
                                "confirmed",
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-2.5 py-1.5 rounded transition disabled:opacity-50"
                          >
                            Confirm
                          </button>
                          <button
                            disabled={actionLoadingId !== null}
                            onClick={() =>
                              handleUpdateStatus(
                                booking._id.toString(),
                                "cancelled",
                              )
                            }
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-2.5 py-1.5 rounded transition disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      <button
                        disabled={actionLoadingId !== null}
                        onClick={() =>
                          handleDeleteBooking(booking._id.toString())
                        }
                        className="text-red-600 hover:text-red-900 text-xs px-2.5 py-1.5 rounded hover:bg-red-50 transition disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
