"use client";

import { categoryLabels } from "@/app/backend/validators/media";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaTabsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function MediaTabs({ value, onValueChange }: MediaTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange}>
      <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
        {Object.entries(categoryLabels).map(([key, label]) => (
          <TabsTrigger
            key={key}
            value={key}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
