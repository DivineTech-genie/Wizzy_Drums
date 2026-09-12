import useSWR from "swr";
import { IMedia } from "@/app/backend/models/media.model";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useMedia() {
  const { data, error, isLoading, mutate } = useSWR<{
    data: IMedia[];
    error?: string;
  }>("/api/media", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60000,
  });

  // Get hero video
  const getHeroVideo = (): IMedia | undefined => {
    return data?.data?.find((item: IMedia) => item.isHero);
  };

  // Get media by category
  const getMediaByCategory = (category: string): IMedia[] => {
    if (!Array.isArray(data?.data)) return [];
    if (category === "all") return data.data;
    return data.data.filter((item: IMedia) => item.category === category);
  };

  // Get all categories (not including 'hero')
  const getCategories = (): string[] => {
    if (!Array.isArray(data?.data)) return [];
    const cats = new Set<string>();
    data.data.forEach((item: IMedia) => cats.add(item.category));
    return Array.from(cats).filter((cat) => cat !== "hero");
  };

  return {
    media: data?.data || [],
    isLoading,
    error: error || data?.error,
    mutate,
    getHeroVideo,
    getMediaByCategory,
    getCategories,
  };
}
