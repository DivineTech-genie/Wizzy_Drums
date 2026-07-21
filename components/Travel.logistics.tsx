// components/booking/travel-logistics-section.tsx
"use client";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";

export function TravelLogisticsForm({ form }: { form: UseFormReturn<any> }) {
  const stateValue =
    useWatch({ control: form.control, name: "eventState" }) || "";
  const providesFlight = useWatch({
    control: form.control,
    name: "providesFlight",
  });
  const requiresAccommodation = useWatch({
    control: form.control,
    name: "requiresAccommodation",
  });

  if (!stateValue.trim()) return null;
  const isLocal = stateValue.trim().toLowerCase() === "enugu";

  return (
    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-4 text-slate-900">
      {isLocal ? (
        <div className="space-y-1">
          <p className="text-xs font-bold text-emerald-600">
            📍 Local Event (Enugu State)
          </p>
          <p className="text-xs text-slate-600">
            Host must arrange local secure ground transportation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-amber-50 text-amber-900 p-3 rounded text-xs border border-amber-200">
            ⚠️ Out-of-state booking requires flight travel routing.
          </div>

          {/* Flight Provisions (Controlled Radio Group) */}
          <Controller
            control={form.control}
            name="flightProvision"
            render={({ field, fieldState: { error } }) => (
              <Field data-invalid={!!error} className="space-y-2">
                <FieldLabel className="text-xs font-bold uppercase text-slate-500">
                  Flight Arrangement
                </FieldLabel>

                <RadioGroup
                  onValueChange={(val) => {
                    field.onChange(val);
                    // 👇 Update the booleans based on selection
                    form.setValue("providesFlight", val === "provide");
                    form.setValue("cannotAffordFlight", val === "charge");
                  }}
                  value={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="provide" id="r1" />
                    <label
                      htmlFor="r1"
                      className="text-sm cursor-pointer font-medium text-slate-700"
                    >
                      I will buy flights
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="charge" id="r2" />
                    <label
                      htmlFor="r2"
                      className="text-sm cursor-pointer font-medium text-slate-700"
                    >
                      Charge flights to quote
                    </label>
                  </div>
                </RadioGroup>

                {error && <FieldError>{error.message}</FieldError>}
              </Field>
            )}
          />

          {/* Accommodation Toggle (Controlled Checkbox) */}
          <Controller
            control={form.control}
            name="requiresAccommodation"
            render={({ field }) => (
              <Field className="flex items-center space-x-3 pt-2 border-t border-slate-200">
                <Checkbox
                  id="accommodation"
                  checked={field.value}
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
