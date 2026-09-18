"use client";

import { useEffect } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { BookingFormValues } from "@/app/backend/validators/validators";
import { cn } from "@/lib/utils";
import { isEasternNigeriaState } from "@/lib/eastern-states";
import { Pin, TriangleAlert } from "lucide-react";

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
      form.setValue("requiresAccommodation", false, { shouldValidate: true });
    }
  }, [form, isLocal, stateValue]);

  if (!stateValue.trim()) return null;

  return (
    <div className="p-4 rounded-lg bg-mauve-50 border border-primary/10 space-y-4 text-slate-900">
      {isLocal ? (
        // ✅ New within-East copy
        <div className="space-y-1">
          <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
            <Pin className="h-4 w-4" />
            You&apos;re all set — this is a local event within the East.
          </p>
          <p className="text-xs text-slate-600">
            No flights or accommodation are required. We&apos;re excited to be
            part of this moment with you.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ✅ Updated notice */}
          <div className="text-red-900 p-3 text-xs border border-primary/10 rounded-xl bg-mauve-100">
            <p className="flex items-start gap-2">
              <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Any booking outside the East comes with a two-way flight and
                accommodation for one. If you cannot provide flights, select
                &quot;Charge flights to quote&quot; and an additional flight
                deposit will be included.
              </span>
            </p>
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
                    ? "border bg-primary/5 text-primary shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary/10 hover:bg-primary/5",
                )}
              >
                <Checkbox
                  id="provide-flights"
                  checked={!!providesFlight}
                  onCheckedChange={(checked) => {
                    const selected = Boolean(checked);
                    form.setValue("providesFlight", selected, {
                      shouldValidate: true,
                    });
                    if (selected) {
                      form.setValue("cannotAffordFlight", false, {
                        shouldValidate: true,
                      });
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
                    ? "border bg-primary/5 text-primary shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary/10 hover:bg-primary/5",
                )}
              >
                <Checkbox
                  id="charge-flights"
                  checked={!!cannotAffordFlight}
                  onCheckedChange={(checked) => {
                    const selected = Boolean(checked);
                    form.setValue("cannotAffordFlight", selected, {
                      shouldValidate: true,
                    });
                    if (selected) {
                      form.setValue("providesFlight", false, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
                <div>
                  <p className="font-medium">Charge flights to quote</p>
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll add the flight cost to your deposit and quote.
                  </p>
                </div>
              </label>
            </div>
          </Field>

          {/* ✅ Accommodation — now mandatory for outside East */}
          <Controller
            control={form.control}
            name="requiresAccommodation"
            render={({ field }) => (
              <label
                htmlFor="accommodation"
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all",
                  requiresAccommodation
                    ? "border bg-primary/5 text-primary shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-primary/10 hover:bg-primary/5",
                )}
              >
                <Checkbox
                  id="accommodation"
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(Boolean(checked));
                  }}
                />
                <div>
                  <p className="font-medium">
                    Accommodation required (for one person)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Upload hotel confirmation below. Required for any booking
                    outside the East.
                  </p>
                </div>
              </label>
            )}
          />
        </div>
      )}
    </div>
  );
}
