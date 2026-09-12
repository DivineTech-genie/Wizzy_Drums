export interface SiteSettings {
  // Site info
  siteName: string;
  tagline: string;
  logoUrl?: string;

  // Bank details
  bankDetails: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    sortCode?: string;
  };

  // Contact details
  contactDetails: {
    email: string;
    phone: string;
    location: string;
    address?: string;
  };

  // Social
  socials?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
  };

  // Preferences
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  twoFactorEnabled: boolean;
}
