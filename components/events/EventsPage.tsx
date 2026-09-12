"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventsHeader } from "./EventsHeader";
import { EventsSearch } from "./EventsSearch";
import { EventsTable } from "./EventsTable";
import { EventDialog } from "./EventDialog";
import { useEvents } from "@/hooks/admin/useEvents";
import { eventSchema, EventFormData, EventType } from "@/app/backend/validators/events";

export default function EventsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

  const {
    filteredEvents,
    loading,
    search,
    setSearch,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      value: "",
      label: "",
      price: 0,
      description: "",
      src: "",
      depositRate: 30,
    },
  });

  const { reset, setValue } = form;

  const handleOpenCreate = () => {
    setEditingEvent(null);
    reset({
      value: "",
      label: "",
      price: 0,
      description: "",
      src: "",
      depositRate: 30,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (event: EventType) => {
    setEditingEvent(event);
    setValue("value", event.value);
    setValue("label", event.label);
    setValue("price", event.price);
    setValue("description", event.description || "");
    setValue("src", event.src || "");
    setValue("depositRate", event.depositRate || 30);
    setDialogOpen(true);
  };

  const handleSubmit = async (data: EventFormData) => {
    if (editingEvent) {
      const result = await updateEvent(editingEvent._id, data);
      if (result.success) {
        setDialogOpen(false);
        setEditingEvent(null);
        reset();
      }
    } else {
      const result = await createEvent(data);
      if (result.success) {
        setDialogOpen(false);
        reset();
      }
    }
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
  };

  return (
    <div className="space-y-6">
      <EventsHeader onAddClick={handleOpenCreate} />
      <EventsSearch value={search} onChange={setSearch} />
      <EventsTable
        events={filteredEvents}
        loading={loading}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />
      <EventDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={!!editingEvent}
        form={form}
        onSubmit={handleSubmit}
        isSubmitting={form.formState.isSubmitting}
      />
    </div>
  );
}
