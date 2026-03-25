import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { useAllPromos, Promo } from "@/hooks/usePromos";
import ImageUpload from "./ImageUpload";

const emptyPromo = {
  title: "",
  subtitle: "",
  badge: "",
  image: "",
  link: "",
  is_active: true,
  sort_order: 0,
};

const AdminPromos = () => {
  const qc = useQueryClient();
  const { data: promos = [], isLoading } = useAllPromos();
  const [editing, setEditing] = useState<Promo | null | "new">(null);
  const [form, setForm] = useState({ ...emptyPromo });

  const save = useMutation({
    mutationFn: async (p: typeof form & { id?: string }) => {
      const payload = {
        title: p.title,
        subtitle: p.subtitle || null,
        badge: p.badge || null,
        image: p.image || null,
        link: p.link || null,
        is_active: p.is_active,
        sort_order: p.sort_order,
      };
      if (p.id) {
        const { error } = await supabase.from("promos").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("promos").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-promos"] });
      qc.invalidateQueries({ queryKey: ["promos"] });
      setEditing(null);
      toast({ title: "Promo sauvegardée !" });
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-promos"] });
      qc.invalidateQueries({ queryKey: ["promos"] });
      toast({ title: "Promo supprimée" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      const { error } = await supabase.from("promos").update({ is_active: val }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-promos"] });
      qc.invalidateQueries({ queryKey: ["promos"] });
    },
  });

  if (editing !== null) {
    const editId = editing !== "new" ? (editing as Promo).id : undefined;
    return (
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">
            {editing === "new" ? "Nouvelle promo" : "Modifier la promo"}
          </h2>
          <button onClick={() => setEditing(null)} className="text-sm text-muted-foreground hover:text-foreground">Annuler</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Titre *</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Sous-titre</label>
            <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Badge (ex: -20%)</label>
            <input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Lien (URL)</label>
            <input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })}
              placeholder="/boutique"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Ordre d'affichage</label>
            <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div className="flex items-center gap-2 pt-5">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
            <label className="text-sm text-foreground">Actif</label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Image</label>
          <ImageUpload value={form.image} onChange={url => setForm({ ...form, image: url })} />
        </div>
        <button onClick={() => save.mutate({ ...form, id: editId })} disabled={save.isPending || !form.title}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 text-sm">
          {save.isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Carrousel Promos ({promos.length})</h2>
        <button onClick={() => { setEditing("new"); setForm({ ...emptyPromo }); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {isLoading ? <p className="text-muted-foreground text-sm">Chargement...</p> : promos.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground text-sm">Aucune promo. Créez votre première slide !</p>
        </div>
      ) : (
        <div className="space-y-2">
          {promos.map((p) => (
            <div key={p.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {p.image && <img src={p.image} alt="" className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                {p.subtitle && <p className="text-xs text-muted-foreground truncate">{p.subtitle}</p>}
                {p.badge && <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{p.badge}</span>}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive.mutate({ id: p.id, val: !p.is_active })}
                  className="p-1.5 text-muted-foreground hover:text-foreground">
                  {p.is_active ? <Eye className="w-4 h-4 text-primary" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => { setEditing(p); setForm({ title: p.title, subtitle: p.subtitle || "", badge: p.badge || "", image: p.image || "", link: p.link || "", is_active: p.is_active, sort_order: p.sort_order }); }}
                  className="p-1.5 text-muted-foreground hover:text-foreground">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => del.mutate(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPromos;
