import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/lib/products";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    staleTime: 1000 * 60 * 5,
    retry: 1,
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        originalPrice: p.original_price ? Number(p.original_price) : undefined,
        shippingPrice: p.shipping_price != null ? Number(p.shipping_price) : null,
        image: p.image,
        category: p.category,
        badge: p.badge as "new" | "bestseller" | undefined,
        promoLabel: p.promo_label || null,
        rating: Number(p.rating),
        reviews: p.reviews,
        shortDescription: p.short_description || "",
        description: p.description || "",
        benefits: p.benefits || [],
        ingredients: (p.ingredients as any[]) || [],
        faq: (p.faq as any[]) || [],
        barcode: p.barcode || null,
        sortOrder: p.sort_order ?? 0,
      }));
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    staleTime: 1000 * 60 * 5,
    retry: 1,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("label");
      if (error) throw error;
      return data || [];
    },
  });
}

