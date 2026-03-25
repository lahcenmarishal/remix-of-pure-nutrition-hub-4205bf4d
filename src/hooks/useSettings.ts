import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  id: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  facebook: string | null;
  instagram: string | null;
  tiktok: string | null;
  youtube: string | null;
  shipping_price: number;
  free_shipping_threshold: number;
  updated_at: string;
}

export function useSettings() {
  return useQuery<SiteSettings>({
    queryKey: ["site_settings"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "main")
        .single();
      if (error) throw error;
      return data as SiteSettings;
    },
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<SiteSettings>) => {
      const { error } = await supabase
        .from("site_settings")
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq("id", "main");
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["site_settings"] }),
  });
}
