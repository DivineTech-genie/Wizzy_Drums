"use client";

import { SiteSettings } from "@/app/backend/validators/settings";
import { SiteInfoForm } from "./SiteInfoForm";
import { BankDetailsForm } from "../forms/BankDetailsForm";
import { SocialLinksForm } from "../forms/SocialLinksForm";
import { ContactDetailsForm } from "../forms/ContactDetailsForm";




interface SiteSettingsTabProps {
  settings: SiteSettings;
  onSave: (updates: Partial<SiteSettings>) => Promise<{ success: boolean }>;
  saving: boolean;
}

export function SiteSettingsTab({
  settings,
  onSave,
  saving,
}: SiteSettingsTabProps) {
  return (
    <div className="space-y-6">
      <SiteInfoForm
        initialData={{
          siteName: settings.siteName,
          tagline: settings.tagline,
          logoUrl: settings.logoUrl,
        }}
        onSave={(data) => onSave(data)}
        saving={saving}
      />

      <BankDetailsForm
        initialData={settings.bankDetails}
        onSave={(data) => onSave({ bankDetails: data })}
        saving={saving}
      />

      <ContactDetailsForm
        initialData={settings.contactDetails}
        onSave={(data) => onSave({ contactDetails: data })}
        saving={saving}
      />

      <SocialLinksForm
        initialData={settings.socials}
        onSave={(data) => onSave({ socials: data })}
        saving={saving}
      />
    </div>
  );
}
