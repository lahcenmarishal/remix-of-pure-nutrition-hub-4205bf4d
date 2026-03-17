import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

const empty = { name: "", role: "", content: "", rating: 5, avatar: "", is_active: true };

const AdminTestimonials = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ ...empty });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (t: typeof form & { id?: string }) => {
      const payload = { name: t.name, role: t.role, content: t.content, rating: t.rating, avatar: t.avatar, is_active: t.is_active };
      if (t.id) {
        const { error } = await supabase.from("testimonials").update(payload).eq("id", t.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("testimonials").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); setEditing(null); toast({ title: "Sauvegardé !" }); },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("testimonials").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); toast({ title: "Supprimé" }); },
  });

  if (editing !== null) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">{editing.id ? "Modifier" : "Nouveau"} témoignage</h2>
          <button onClick={() => setEditing(null)} className="text-sm text-muted-foreground hover:text-foreground">Annuler</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nom</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Rôle</label>
            <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Contenu</label>
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Note (1-5)</label>
          <input type="number" min={1} max={5} value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} className="w-20 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Avatar</label>
          <ImageUpload value={form.avatar} onChange={url => setForm({ ...form, avatar: url })} folder="avatars" />
        </div>
        <button onClick={() => save.mutate({ ...form, id: editing.id })} disabled={save.isPending}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 text-sm">
          {save.isPending ? "..." : "Enregistrer"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Témoignages ({items.length})</h2>
        <button onClick={() => { setEditing({}); setForm({ ...empty }); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>
      {isLoading ? <p className="text-muted-foreground">Chargement...</p> : (
        <div className="space-y-3">
          {items.map((t: any) => (
            <div key={t.id} className="flex items-start gap-4 bg-card border border-border rounded-xl p-4">
              {t.avatar && <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{t.name} <span className="text-muted-foreground text-xs">— {t.role}</span></p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{t.content}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(t); setForm({ name: t.name, role: t.role || "", content: t.content, rating: t.rating, avatar: t.avatar || "", is_active: t.is_active }); }} className="p-1.5 text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => del.mutate(t.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
