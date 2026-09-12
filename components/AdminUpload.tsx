"use client";

import { useState } from "react";
import {
  Download,
  ExternalLink,
  Search,
  Grid,
  List,
  Eye,
  Hotel,
  Plane,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useBookings } from "@/hooks/admin/useBooking";

export default function UploadsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const { bookings, loading } = useBookings({ search });

  // Collect all files from bookings
  const files = bookings.flatMap((booking) => {
    const items = [];
    if (booking.flightTicketUrl) {
      items.push({
        id: `${booking._id}-flight`,
        bookingId: booking._id,
        clientName: booking.clientName,
        eventDate: booking.eventDate,
        type: "flight",
        label: "Flight Ticket",
        url: booking.flightTicketUrl,
        verified: booking.logisticsVerified,
      });
    }
    if (booking.hotelTicketUrl) {
      items.push({
        id: `${booking._id}-hotel`,
        bookingId: booking._id,
        clientName: booking.clientName,
        eventDate: booking.eventDate,
        type: "hotel",
        label: "Hotel Confirmation",
        url: booking.hotelTicketUrl,
        verified: booking.logisticsVerified,
      });
    }
    return items;
  });

  const flightFiles = files.filter((f) => f.type === "flight");
  const hotelFiles = files.filter((f) => f.type === "hotel");

  const getFileIcon = (type: string) => {
    return type === "flight" ? (
      <Plane className="h-4 w-4" />
    ) : (
      <Hotel className="h-4 w-4" />
    );
  };

  const getTypeColor = (type: string) => {
    return type === "flight"
      ? "text-blue-500 bg-blue-500/10"
      : "text-purple-500 bg-purple-500/10";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold">Uploads Management</h1>
        <p className="text-muted-foreground">
          Manage all uploaded flight tickets and hotel confirmations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Flight Tickets</p>
              <p className="text-2xl font-bold">{flightFiles.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-500/10">
              <Plane className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Hotel Confirmations
              </p>
              <p className="text-2xl font-bold">{hotelFiles.length}</p>
            </div>
            <div className="p-3 rounded-full bg-purple-500/10">
              <Hotel className="h-5 w-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files by client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1 border rounded-lg p-1">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No uploaded files found
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="overflow-hidden group">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${getTypeColor(file.type)}`}
                    >
                      {getFileIcon(file.type)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{file.clientName}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(file.eventDate), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={file.verified ? "default" : "outline"}
                    className="text-xs"
                  >
                    {file.verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1">
                    <a href={file.url} download>
                      <Download className="h-3 w-3" />
                      Download
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${getTypeColor(file.type)}`}>
                        {getFileIcon(file.type)}
                      </div>
                      <span className="text-sm">{file.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>{file.clientName}</TableCell>
                  <TableCell>
                    {format(new Date(file.eventDate), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={file.verified ? "default" : "outline"}
                      className="text-xs"
                    >
                      {file.verified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-8 w-8">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8">
                        <a href={file.url} download>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
