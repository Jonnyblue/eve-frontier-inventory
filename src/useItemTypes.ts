import { useQuery } from "@tanstack/react-query";
import { fetchAllItemTypes, type ItemType } from "./worldApi";

export function useItemTypes() {
  return useQuery<Map<number, ItemType>>({
    queryKey: ["itemTypes"],
    queryFn: fetchAllItemTypes,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
