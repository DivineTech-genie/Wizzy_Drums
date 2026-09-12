// components/booking/travel-logistics-section.tsx
"use client";

import { useEffect } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { BookingFormValues } from "@/app/backend/validators/validators";
import { cn } from "@/lib/utils";
import { isEasternNigeriaState } from "@/lib/eastern-states";

export function TravelLogisticsForm({
  form,
}: {
  form: UseFormReturn<BookingFormValues>;
}) {
  const stateValue =
    useWatch({ control: form.control, name: "eventState" }) || "";
  const providesFlight = useWatch({
    control: form.control,
    name: "providesFlight",
  });
  const cannotAffordFlight = useWatch({
    control: form.control,
    name: "cannotAffordFlight",
  });
  const requiresAccommodation = useWatch({
    control: form.control,
    name: "requiresAccommodation",
  });

  const isLocal = isEasternNigeriaState(stateValue);

  useEffect(() => {
    if (stateValue.trim() && isLocal) {
      form.setValue("providesFlight", false, { shouldValidate: true });
      form.setValue("cannotAffordFlight", false, { shouldValidate: true });
    }
  }, [form, isLocal, stateValue]);

  if (!stateValue.trim()) return null;

  return (
    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4 text-slate-900">
      {isLocal ? (
        <div className="space-y-1">
          <p className="text-xs font-bold text-emerald-600">
            📍 Local Event {`in (${stateValue})`}
          </p>
          <p className="text-xs text-slate-600">
            Host must arrange local secure ground transportation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-amber-50 text-amber-900 p-3 rounded text-xs border border-amber-200">
            ⚠️ Any booking outside the east come with a two-way flight for one
            and accommodation.
          </div>

          <Field className="space-y-3">
            <FieldLabel className="text-xs font-bold uppercase text-slate-500">
              Flight Arrangement
            </FieldLabel>
            <div className="grid gap-3">
              <label
                htmlFor="provide-flights"
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all",
                  providesFlight
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary/50 hover:bg-primary/5",
                )}
              >
                <Checkbox
                  id="provide-flights"
                  checked={!!providesFlight}
                  onCheckedChange={(checked) => {
                    const selected = Boolean(checked);
                    form.setValue("providesFlight", selected);
                    if (selected) {
                      form.setValue("cannotAffordFlight", false);
                    }
                  }}
                />
                <div>
                  <p className="font-medium">I will buy flights</p>
                  <p className="text-xs text-muted-foreground">
                    Upload flight ticket once purchased.
                  </p>
                </div>
              </label>

              <label
                htmlFor="charge-flights"
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all",
                  cannotAffordFlight
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary/50 hover:bg-primary/5",
                )}
              >
                <Checkbox
                  id="charge-flights"
                  checked={!!cannotAffordFlight}
                  onCheckedChange={(checked) => {
                    const selected = Boolean(checked);
                    form.setValue("cannotAffordFlight", selected);
                    if (selected) {
                      form.setValue("providesFlight", false);
                    }
                  }}
                />
                <div>
                  <p className="font-medium">Charge flights to quote</p>
                  <p className="text-xs text-muted-foreground">
                    We’ll add the flight cost to your deposit and quote.
                  </p>
                </div>
              </label>
            </div>
          </Field>

          {/* Accommodation Toggle (Controlled Checkbox) */}
          <Controller
            control={form.control}
            name="requiresAccommodation"
            render={({ field }) => (
              <Field className="flex items-center space-x-3 pt-2 border-t border-slate-200">
                <Checkbox
                  id="accommodation"
                  checked={field.value}
                  onClick={() => {
                    field.onChange(!field.value);
                  }}
                  onCheckedChange={field.onChange}
                />
                <FieldLabel
                  htmlFor="accommodation"
                  className="cursor-pointer text-sm font-medium"
                >
                  Requires overnight stay / hotel booking
                </FieldLabel>
              </Field>
            )}
          />

          {requiresAccommodation && (
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
              📋 Hotel confirmation will be uploaded in the main form.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
