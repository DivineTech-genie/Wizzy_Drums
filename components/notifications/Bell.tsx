"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "booking" | "logistics" | "reminder" | "system";
  read: boolean;
  link?: string;
  createdAt: string;
}

/** Displays administrative notifications and manages their read state. */
export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/admin/notifications");
      const data = await response.json();
      if (data.status === "success") {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      } else {
        toast.error(data.message || "Failed to load notifications");
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to mark notification as read");
        return;
      }

      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n._id);
    await Promise.all(unreadIds.map((id) => markAsRead(id)));
  };

  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to delete notification");
        return;
      }

      setNotifications(notifications.filter((n) => n._id !== id));
      if (!notifications.find((n) => n._id === id)?.read) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-blue-500/10 text-blue-500";
      case "logistics":
        return "bg-amber-500/10 text-amber-500";
      case "reminder":
        return "bg-emerald-500/10 text-emerald-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
      <PopoverContent className="w-95 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <ScrollArea className="h-100">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No notifications yet
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors",
                    !notification.read && "bg-primary/5",
                  )}
                >
                  <div
                    className={cn(
                      "p-1.5 rounded-full",
                      getTypeColor(notification.type),
                    )}
                  >
                    <Bell className="h-3 w-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">
                        {notification.title}
                      </p>
                      <div className="flex gap-1 shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-0.5 text-muted-foreground hover:text-foreground"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-0.5 text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
