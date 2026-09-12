"use client";

import { Input } from "@/components/ui/input";

interface MediaSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function MediaSearch({ value, onChange }: MediaSearchProps) {
  return (
    <div className="relative">
      <Input
        placeholder="Search media..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
