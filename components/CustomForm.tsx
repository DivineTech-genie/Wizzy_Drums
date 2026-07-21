// components/ui/custom-form-field.tsx
"use client";

import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldError, // Added for rendering errors
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, UseFormReturn } from "react-hook-form";

interface CustomFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  description?: string; // Optional field helper text
}

export function CustomInputField({
  form,
  name,
  label,
  type = "text",
  placeholder,
  description,
}: CustomFieldProps) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const hasError = !!error;

        return (
          // Use data-invalid so shadcn styles the label/border red on error
          <Field className="space-y-1" data-invalid={hasError}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

            <Input
              id={field.name}
              type={type}
              placeholder={placeholder}
              aria-invalid={hasError} // Accessible for screen readers
              autoComplete="on"
              {...field}
            />

            {/* Render helper text if passed */}
            {description && <FieldDescription>{description}</FieldDescription>}

            {/* Display validation error message automatically */}
            {hasError && <FieldError>{error?.message}</FieldError>}
          </Field>
        );
      }}
    />
  );
}
