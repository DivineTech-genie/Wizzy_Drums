"use client";

import { useState } from "react";
import {
  Plane,
  Hotel,
  CheckCircle,
  XCircle,
  ExternalLink,
  Search,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function LogisticsPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { bookings, loading } = useBookings({ search });

  // Filter bookings that have logistics data
  const logisticsBookings = bookings.filter(
    (b) =>
      b.providesFlight ||
      b.requiresAccommodation ||
      b.flightTicketUrl ||
      b.hotelTicketUrl ||
      b.depositReceiptUrl,
  );

  const pendingLogistics = logisticsBookings.filter(
    (b) => !b.logisticsVerified,
  );
  const verifiedLogistics = logisticsBookings.filter(
    (b) => b.logisticsVerified,
  );

  const filteredBookings =
    activeTab === "all"
      ? logisticsBookings
      : activeTab === "pending"
        ? pendingLogistics
        : verifiedLogistics;

  const handleVerify = async (id: string, verified: boolean) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logisticsVerified: verified }),
      });

      if (response.ok) {
        // Refresh bookings
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to verify logistics:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">
            Logistics Management
          </h1>
          <p className="text-muted-foreground">
            Review and verify travel arrangements for bookings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {pendingLogistics.length} pending verification
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Logistics</p>
              <p className="text-2xl font-bold">{logisticsBookings.length}</p>
            </div>
            <div className="p-3 rounded-full bg-primary/10">
              <Plane className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Verification
              </p>
              <p className="text-2xl font-bold text-amber-500">
                {pendingLogistics.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-amber-500/10">
              <XCircle className="h-5 w-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-emerald-500">
                {verifiedLogistics.length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-emerald-500/10">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Logistics</TabsTrigger>
            <TabsTrigger value="pending">Pending Verification</TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Flight</TableHead>
              <TableHead>Accommodation</TableHead>
              <TableHead>Receipt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  No logistics bookings found
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>
                    <p className="font-medium">{booking.clientName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.clientEmail}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{booking.eventType}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(booking.eventDate), "dd MMM yyyy")}
                    </p>
                  </TableCell>
                  <TableCell>
                    {booking.flightTicketUrl ? (
                      <a
                        href={booking.flightTicketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Plane className="h-3 w-3" />
                        View Ticket
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Not provided
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.hotelTicketUrl ? (
                      <a
                        href={booking.hotelTicketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <Hotel className="h-3 w-3" />
                        View Confirmation
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Not required
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.depositReceiptUrl ? (
                      <a
                        href={booking.depositReceiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <FileText className="h-3 w-3" />
                        View Receipt
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Not uploaded
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.logisticsVerified ? (
                      <Badge variant="default" className="bg-emerald-500">
                        Verified
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-amber-500 border-amber-500"
                      >
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!booking.logisticsVerified && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-emerald-500 border-emerald-500 hover:bg-emerald-500/10"
                          onClick={() => handleVerify(booking._id, true)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verify
                        </Button>
                      )}
                      {booking.logisticsVerified && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-500 border-amber-500 hover:bg-amber-500/10"
                          onClick={() => handleVerify(booking._id, false)}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Unverify
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
