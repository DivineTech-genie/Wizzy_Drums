"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { EventFormData, EventType } from "@/app/backend/validators/events";

export function useEvents() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      setEvents(data.data || []);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (data: EventFormData) => {
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Event created");
        await fetchEvents();
        return { success: true };
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create");
        return { success: false, error };
      }
    } catch {
      toast.error("Error creating event");
      return { success: false };
    }
  };

  const updateEvent = async (id: string, data: Partial<EventFormData>) => {
    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Event updated");
        await fetchEvents();
        return { success: true };
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to update");
        return { success: false, error };
      }
    } catch {
      toast.error("Error updating event");
      return { success: false };
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event type?")) return { success: false };

    try {
      const res = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Event deleted");
        await fetchEvents();
        return { success: true };
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to delete");
        return { success: false };
      }
    } catch {
      toast.error("Failed to delete");
      return { success: false };
    }
  };

  const filteredEvents = events.filter((event) => {
    const searchLower = search.toLowerCase();
    return (
      event?.label?.toLowerCase()?.includes(searchLower) ||
      event?.value?.toLowerCase()?.includes(searchLower) ||
      event?.description?.toLowerCase()?.includes(searchLower)
    );
  });

  return {
    events,
    filteredEvents,
    loading,
    search,
    setSearch,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
