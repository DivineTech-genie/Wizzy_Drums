"use client";

import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Bell, BellOff, Mail, MessageCircleOff } from "lucide-react";
import { SiteSettings } from "@/app/backend/validators/settings";

interface PreferencesTabProps {
  settings: SiteSettings;
  onSave: (updates: Partial<SiteSettings>) => Promise<{ success: boolean }>;
  saving: boolean;
}

export function PreferencesTab({
  settings,
  onSave,
  saving,
}: PreferencesTabProps) {
  const { setTheme } = useTheme();

  const toggleDarkMode = async (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    await onSave({ darkMode: checked });
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="font-heading text-lg font-semibold">Preferences</h3>
          <p className="text-sm text-muted-foreground">
            Customize your admin experience
          </p>
        </div>

        <div className="space-y-4">
          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  {settings.darkMode
                    ? "Dark theme enabled"
                    : "Light theme enabled"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={toggleDarkMode}
            />
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.emailNotifications ? (
                <Mail className="h-5 w-5" />
              ) : (
                <MessageCircleOff className="h-5 w-5" />
              )}
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  {settings.emailNotifications
                    ? "You'll receive email alerts"
                    : "Email alerts are turned off"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) =>
                onSave({ emailNotifications: checked })
              }
            />
          </div>

          {/* In-App Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.pushNotifications ? (
                <Bell className="h-5 w-5" />
              ) : (
                <BellOff className="h-5 w-5" />
              )}
              <div>
                <p className="font-medium">In-App Notifications</p>
                <p className="text-sm text-muted-foreground">
                  {settings.pushNotifications
                    ? "You'll see notifications in the app"
                    : "In-app notifications are turned off"}
                </p>
              </div>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) =>
                onSave({ pushNotifications: checked })
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
