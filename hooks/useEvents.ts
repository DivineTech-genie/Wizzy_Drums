import useSWR from "swr";
import { EventType } from "@/app/backend/validators/events";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useEvents() {
  const { data, error, isLoading, mutate } = useSWR<{
    data: EventType[];
    error?: string;
  }>("/api/events", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  return {
    events: data?.data || ([] as EventType[]),
    loading: isLoading,
    error: error || data?.error,
    mutate,
  };
}
