import { format } from "date-fns";

interface Booking {
  _id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventType: string;
  eventState: string;
  status: string;
  createdAt: string;
}

export function useExport() {
  const exportToCSV = (bookings: Booking[], filename = "bookings") => {
    // Define headers
    const headers = [
      "Client Name",
      "Email",
      "Phone",
      "Event Date",
      "Event Time",
      "Event Type",
      "Location",
      "State",
      "Status",
      "Created At",
    ];

    // Format data
    const rows = bookings.map((b) => [
      b.clientName,
      b.clientEmail,
      b.clientPhone,
      format(new Date(b.eventDate), "dd/MM/yyyy"),
      b.eventTime,
      b.eventType,
      b.eventLocation,
      b.eventState,
      b.status,
      format(new Date(b.createdAt), "dd/MM/yyyy HH:mm"),
    ]);

    // Build CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return { exportToCSV };
}
