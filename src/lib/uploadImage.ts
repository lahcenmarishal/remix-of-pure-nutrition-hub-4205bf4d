import { supabase } from "@/integrations/supabase/client";

export async function uploadImage(file: File, folder = "products"): Promise<string> {
  const ext = file.name.split(".").pop();
  const name = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("images").upload(name, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("images").getPublicUrl(name);
  return data.publicUrl;
}
