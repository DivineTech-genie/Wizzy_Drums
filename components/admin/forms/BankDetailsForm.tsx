"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Building2 } from "lucide-react";

interface BankDetailsFormProps {
  initialData: {
    accountName: string;
    bankName: string;
    accountNumber: string;
    sortCode: string;
  };
  onSave: (data: any) => Promise<{ success: boolean }>;
  saving: boolean;
}

export function BankDetailsForm({
  initialData,
  onSave,
  saving,
}: BankDetailsFormProps) {
  const [data, setData] = useState(initialData);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Bank Transfer Details
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          These details appear on the booking deposit step for client transfers.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountName">Account Name</Label>
          <Input
            id="accountName"
            value={data.accountName}
            onChange={(e) => setData({ ...data, accountName: e.target.value })}
            placeholder="The Booking Co"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankName">Bank Name</Label>
          <Input
            id="bankName"
            value={data.bankName}
            onChange={(e) => setData({ ...data, bankName: e.target.value })}
            placeholder="Zenith Bank"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={data.accountNumber}
              onChange={(e) =>
                setData({ ...data, accountNumber: e.target.value })
              }
              placeholder="0123456789"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortCode">Sort Code (optional)</Label>
            <Input
              id="sortCode"
              value={data.sortCode}
              onChange={(e) => setData({ ...data, sortCode: e.target.value })}
              placeholder="000000"
            />
          </div>
        </div>

        <Button
          onClick={() => onSave(data)}
          disabled={saving}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Bank Details"}
        </Button>
      </CardContent>
    </Card>
  );
}
