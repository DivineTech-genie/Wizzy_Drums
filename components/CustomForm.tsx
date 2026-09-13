"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, UseFormReturn, FieldValues, Path } from "react-hook-form";
import type { FocusEvent } from "react";

interface CustomFieldProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  description?: string;
  onBlur?: (
    e: FocusEvent<HTMLInputElement>,
    field: { value: unknown; name: Path<T> },
  ) => void;
}

export function CustomInputField<T extends FieldValues = FieldValues>({
  form,
  name,
  label,
  type = "text",
  placeholder,
  description,
  onBlur,
}: CustomFieldProps<T>) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const hasError = !!error;

        return (
          <Field className="space-y-1" data-invalid={hasError}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            <Input
              id={field.name}
              type={type}
              placeholder={placeholder}
              aria-invalid={hasError}
              autoComplete="on"
              className="w-full px-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              {...field}
              onBlur={(e) => {
                if (onBlur) {
                  onBlur(e, field);
                } else {
                  field.onBlur();
                }
              }}
            />

            {description && <FieldDescription>{description}</FieldDescription>}

            {hasError && <FieldError>{error?.message}</FieldError>}
          </Field>
        );
      }}
    />
  );
}
