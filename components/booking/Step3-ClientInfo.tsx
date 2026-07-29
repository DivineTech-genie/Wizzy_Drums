"use client";

import { UseFormReturn } from "react-hook-form";
import { User, Mail, Phone } from "lucide-react";
import { CustomInputField } from "../CustomForm";

interface Step3ClientInfoProps {
  form: UseFormReturn<any>;
}

export function Step3ClientInfo({ form }: Step3ClientInfoProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold">Your Information</h2>
        <p className="text-muted-foreground text-sm">
          We&apos;ll send your quote and booking confirmation to these details
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-5">
        <div className="relative">
          <CustomInputField
            form={form}
            name="clientName"
            label="Full Name"
            placeholder="Enter your full name"
          />
          <User className="absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="relative">
          <CustomInputField
            form={form}
            name="clientEmail"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
          />
          <Mail className="absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
        </div>

        <div className="relative">
          <CustomInputField
            form={form}
            name="clientPhone"
            label="Phone Number"
            type="tel"
            placeholder="080 1234 5678"
          />
          <Phone className="absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Special Requests / Notes
          </label>
          <textarea
            {...form.register("specialRequests")}
            placeholder="Any special requirements, tech rider details, or additional information..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>
      </div>

      {/* Trust Badge */}
      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Secure & encrypted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            No spam, ever
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            GDPR compliant
          </span>
        </div>
      </div>
    </div>
  );
}
