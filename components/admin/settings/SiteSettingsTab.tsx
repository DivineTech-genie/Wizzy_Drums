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
          siteName: settings.siteName ?? "",
          tagline: settings.tagline ?? "",
          logoUrl: settings.logoUrl ?? "",
        }}
        onSave={(data) => onSave(data)}
        saving={saving}
      />

      <BankDetailsForm
        initialData={{
          accountName: settings.bankDetails?.accountName ?? "",
          bankName: settings.bankDetails?.bankName ?? "",
          accountNumber: settings.bankDetails?.accountNumber ?? "",
          sortCode: settings.bankDetails?.sortCode ?? "",
        }}
        onSave={(data) => onSave({ bankDetails: data })}
        saving={saving}
      />

      <ContactDetailsForm
        initialData={{
          email: settings.contactDetails?.email ?? "",
          phone: settings.contactDetails?.phone ?? "",
          location: settings.contactDetails?.location ?? "",
          address: settings.contactDetails?.address ?? "",
        }}
        onSave={(data) => onSave({ contactDetails: data })}
        saving={saving}
      />

      <SocialLinksForm
        initialData={{
          instagram: settings.socials?.instagram ?? "",
          twitter: settings.socials?.twitter ?? "",
          youtube: settings.socials?.youtube ?? "",
          facebook: settings.socials?.facebook ?? "",
        }}
        onSave={(data) => onSave({ socials: data })}
        saving={saving}
      />
    </div>
  );
}
