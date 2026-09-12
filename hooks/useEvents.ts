import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useEvents() {
  const { data, error, isLoading, mutate } = useSWR("/api/events", fetcher, {
    revalidateOnFocus: true, // Re‑fetch when the user refocuses the tab
    revalidateOnReconnect: true, // Re‑fetch when network reconnects
    dedupingInterval: 60000, // Avoid duplicate requests within 1 minute
  });

  return {
    events: data?.data || [],
    loading: isLoading,
    error: error || data?.error,
    mutate, // Expose mutate for manual revalidation
  };
}
