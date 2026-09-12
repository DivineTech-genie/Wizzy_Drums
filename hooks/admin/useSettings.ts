"use client";

import {
  DEFAULT_SETTINGS,
  SiteSettings,
} from "@/app/backend/validators/settings";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const mergeSettings = (value: Partial<SiteSettings> = {}): SiteSettings => ({
  ...DEFAULT_SETTINGS,
  ...value,
  bankDetails: {
    ...DEFAULT_SETTINGS.bankDetails,
    ...(value.bankDetails ?? {}),
  },
  contactDetails: {
    ...DEFAULT_SETTINGS.contactDetails,
    ...(value.contactDetails ?? {}),
  },
  socials: {
    ...DEFAULT_SETTINGS.socials,
    ...(value.socials ?? {}),
  },
});

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.status === "success" && data.data) {
        setSettings(mergeSettings(data.data));
      }
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();
  }, [fetchSettings]);

  const saveSettings = async (updates: Partial<SiteSettings>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mergeSettings({ ...settings, ...updates })),
      });

      if (res.ok) {
        const merged = mergeSettings({ ...settings, ...updates });
        setSettings(merged);
        toast.success("Settings saved");
        return { success: true, data: merged };
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to save");
        return { success: false };
      }
    } catch {
      toast.error("Error saving settings");
      return { success: false };
    } finally {
      setSaving(false);
    }
  };

  return {
    settings,
    loading,
    saving,
    fetchSettings,
    saveSettings,
  };
}
