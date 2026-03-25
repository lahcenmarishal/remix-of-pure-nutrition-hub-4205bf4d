import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Promo {
  id: string;
  title: string;
  subtitle: string | null;
  badge: string | null;
  image: string | null;
  link: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export function usePromos() {
  return useQuery<Promo[]>({
    queryKey: ["promos"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return (data || []) as Promo[];
    },
  });
}

export function useAllPromos() {
  return useQuery<Promo[]>({
    queryKey: ["admin-promos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promos")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return (data || []) as Promo[];
    },
  });
}
