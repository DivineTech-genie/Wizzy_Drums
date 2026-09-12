// app/admin/settings/page.tsx
"use client";

import { PreferencesTab } from "@/components/admin/settings/PreferencesTab";
import { ProfileTab } from "@/components/admin/settings/ProfileTab";
import { SettingsHeader } from "@/components/admin/settings/SettingsHeader";
import { SiteSettingsTab } from "@/components/admin/settings/SiteSettingsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings } from "@/hooks/admin/useSettings";

export default function SettingsPage() {
  const { settings, loading, saving, saveSettings } = useSettings();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsHeader />

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="site">Site Settings</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="site">
          <SiteSettingsTab
            settings={settings}
            onSave={saveSettings}
            saving={saving}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab
            settings={settings}
            onSave={saveSettings}
            saving={saving}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
