// app/admin/settings/components/forms/ContactDetailsForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Mail } from "lucide-react";

interface ContactDetailsFormProps {
  initialData: {
    email: string;
    phone: string;
    location: string;
    address: string;
  };
  onSave: (data: any) => Promise<{ success: boolean }>;
  saving: boolean;
}

export function ContactDetailsForm({
  initialData,
  onSave,
  saving,
}: ContactDetailsFormProps) {
  const [data, setData] = useState(initialData);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Contact Information
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          These details appear on the public contact page.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email Address</Label>
          <Input
            id="contactEmail"
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="hello@stagebook.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone Number</Label>
          <Input
            id="contactPhone"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            placeholder="+234 800 000 0000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactLocation">Location (City, Country)</Label>
          <Input
            id="contactLocation"
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
            placeholder="Lagos, Nigeria"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactAddress">Full Address (optional)</Label>
          <Input
            id="contactAddress"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
            placeholder="123 Example Street..."
          />
        </div>

        <Button
          onClick={() => onSave(data)}
          disabled={saving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Contact Details"}
        </Button>
      </CardContent>
    </Card>
  );
}
