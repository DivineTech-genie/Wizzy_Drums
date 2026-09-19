"use client";

import { UseFormReturn, useWatch } from "react-hook-form";
import { Check, Plane, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { BookingFormValues } from "@/app/backend/validators/validators";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadFileToCloudinary } from "@/lib/upload-file";
import { useState, useEffect } from "react";
import { useBookingPricing } from "@/hooks/useBookingPricing";

interface Step4DepositProps {
  form: UseFormReturn<BookingFormValues>;
}

/** Displays deposit instructions and uploads the booking receipt. */
export function Step4Deposit({ form }: Step4DepositProps) {
  const eventType =
    useWatch({
      control: form.control,
      name: "eventType",
    }) || "Wedding";
  const cannotAffordFlight = useWatch({
    control: form.control,
    name: "cannotAffordFlight",
  });

  const { eventPrice, depositRate, depositAmount, flightDepositAmount } =
    useBookingPricing(eventType, Boolean(cannotAffordFlight));

  const flightCharge = cannotAffordFlight ? flightDepositAmount : 0;
  const minimumDeposit = depositAmount + flightCharge;

  const depositError = form.formState.errors.depositConfirmed?.message;
  const receiptError = form.formState.errors.depositReceiptUrl?.message;
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [accountRef, setAccountRef] = useState<string>("000000");

  useEffect(() => {
    setAccountRef(String(Math.floor(100000 + Math.random() * 900000)));
  }, []);

  const handleReceiptUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingReceipt(true);
    try {
      const url = await uploadFileToCloudinary(file);
      form.setValue("depositReceiptUrl", url, { shouldValidate: true });
      toast.success("Deposit receipt uploaded successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload receipt.";
      toast.error(message);
    } finally {
      setUploadingReceipt(false);
    }
  };

  // Fetch settings once
  const [bankDetails, setBankDetails] = useState({
    accountName: "The Booking Co",
    bankName: "Zenith Bank",
    accountNumber: "0123456789",
  });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.data?.bankDetails) {
          setBankDetails(d.data.bankDetails);
        }
      })
      .catch(() => {
        toast.error("Unable to load bank details right now");
      });
  }, []);

  return (
    <>
      <div className="stack-lg">
        <div className="text-center">
          <h2 className="heading-sm">Deposit & Lock Date</h2>
          <p className="text-muted-foreground text-sm">
            Confirm the deposit amount to secure your event date and travel
            support.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-primary/10 bg-primary/5 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Event estimate
            </p>
            <p className="mt-2 text-3xl font-heading font-bold text-primary">
              ₦{eventPrice.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {eventType} pricing based on your selected package.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-card p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Deposit required
            </p>
            <p className="mt-2 text-3xl font-heading font-bold text-foreground">
              ₦{minimumDeposit.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {depositRate * 100}% deposit of ₦{depositAmount.toLocaleString()}
              {flightCharge > 0 && (
                <> + flight deposit of ₦{flightCharge.toLocaleString()}</>
              )}
            </p>
          </div>
        </div>

        {flightCharge > 0 && (
          <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-primary-900">
            <div className="flex items-start gap-3">
              <Plane className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium">Flight deposit added</p>
                <p className="text-sm text-muted-foreground">
                  Because you chose &quot;Charge flights to quote&quot;, the
                  flight deposit of ₦{flightCharge.toLocaleString()} has been
                  included in the total.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-3xl border bg-card p-5">
          <label className="flex items-start gap-3">
            <Checkbox
              checked={form.watch("depositConfirmed")}
              onCheckedChange={(checked) =>
                form.setValue("depositConfirmed", Boolean(checked), {
                  shouldValidate: true,
                })
              }
            />
            <div>
              <p className="font-medium">
                I confirm this deposit to lock my date
              </p>
              <p className="text-sm text-muted-foreground">
                I understand that this deposit is required to hold the event
                date.
              </p>
              {depositError && (
                <p className="mt-2 text-sm text-destructive">{depositError}</p>
              )}
            </div>
          </label>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <p className="text-sm">
              Once confirmed, your booking request will move to the final review
              step.
            </p>
          </div>
        </div>
      </div>

      {/* Account details for transfer */}
      <div className="rounded-xl border bg-muted/10 p-4 my-4">
        <p className="text-md font-medium">Bank transfer details</p>
        <p className="text-sm text-muted-foreground mt-1">
          Account name: {bankDetails.accountName}
        </p>
        <p className="text-sm text-muted-foreground">
          Bank: {bankDetails.bankName}
        </p>
        <p className="text-sm text-muted-foreground">
          Account number: {bankDetails.accountNumber}
        </p>
        <p className="text-sm text-muted-foreground">Reference: {accountRef}</p>
        <p className="text-xs text-red-900 mt-2">
          Please transfer the deposit to the account above and upload your
          transfer receipt below.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <label className="block text-sm font-medium mb-2">
          Upload deposit receipt
        </label>
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={handleReceiptUpload}
          disabled={uploadingReceipt}
          className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90"
        />
        {uploadingReceipt && (
          <p className="text-xs text-primary mt-2">Uploading...</p>
        )}
        {form.watch("depositReceiptUrl") && (
          <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Receipt uploaded
          </p>
        )}
        {receiptError && (
          <p className="mt-2 text-sm text-destructive">{receiptError}</p>
        )}
      </div>
    </>
  );
}
