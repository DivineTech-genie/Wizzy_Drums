"use client";

import { Input } from "@/components/ui/input";

interface EventsSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function EventsSearch({
  value,
  onChange,
  placeholder = "Search events by name or label...",
}: EventsSearchProps) {
  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
