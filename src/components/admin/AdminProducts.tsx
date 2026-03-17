import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

const emptyProduct = {
  name: "", slug: "", price: 0, original_price: null as number | null,
  image: "", category: "", badge: null as string | null,
  short_description: "", description: "",
  benefits: [] as string[], ingredients: [] as any[], faq: [] as any[],
  is_active: true, rating: 0, reviews: 0,
};

const AdminProducts = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ ...emptyProduct });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (p: typeof form & { id?: string }) => {
      const payload = {
        name: p.name, slug: p.slug, price: p.price, original_price: p.original_price,
        image: p.image, category: p.category, badge: p.badge,
        short_description: p.short_description, description: p.description,
        benefits: p.benefits, ingredients: p.ingredients, faq: p.faq,
        is_active: p.is_active, rating: p.rating, reviews: p.reviews,
      };
      if (p.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      setEditing(null);
      setForm({ ...emptyProduct });
      toast({ title: "Produit sauvegardé !" });
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Produit supprimé" });
    },
  });

  const startEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, slug: p.slug, price: Number(p.price), original_price: p.original_price ? Number(p.original_price) : null,
      image: p.image, category: p.category, badge: p.badge,
      short_description: p.short_description || "", description: p.description || "",
      benefits: p.benefits || [], ingredients: p.ingredients || [], faq: p.faq || [],
      is_active: p.is_active, rating: Number(p.rating), reviews: p.reviews,
    });
  };

  const startNew = () => {
    setEditing({});
    setForm({ ...emptyProduct });
  };

  if (editing !== null) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">
            {editing.id ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <button onClick={() => setEditing(null)} className="text-sm text-muted-foreground hover:text-foreground">Annuler</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nom</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Slug</label>
            <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Prix (DH)</label>
            <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Prix barré</label>
            <input type="number" step="0.01" value={form.original_price || ""} onChange={e => setForm({ ...form, original_price: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Catégorie</label>
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Badge</label>
            <select value={form.badge || ""} onChange={e => setForm({ ...form, badge: e.target.value || null })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm">
              <option value="">Aucun</option>
              <option value="new">Nouveau</option>
              <option value="bestseller">Best Seller</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Image</label>
          <ImageUpload value={form.image} onChange={url => setForm({ ...form, image: url })} />
          {!form.image && (
            <input placeholder="Ou URL directe" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
              className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description courte</label>
          <textarea value={form.short_description} onChange={e => setForm({ ...form, short_description: e.target.value })}
            rows={2} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            rows={4} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Bénéfices (un par ligne)</label>
          <textarea value={form.benefits.join("\n")} onChange={e => setForm({ ...form, benefits: e.target.value.split("\n").filter(Boolean) })}
            rows={3} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
          <label className="text-sm text-foreground">Actif</label>
        </div>
        <button onClick={() => save.mutate({ ...form, id: editing.id })} disabled={save.isPending}
          className="px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm">
          {save.isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Produits ({products.length})</h2>
        <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>
      {isLoading ? <p className="text-muted-foreground">Chargement...</p> : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-3 font-medium text-foreground">Image</th>
                <th className="text-left p-3 font-medium text-foreground">Nom</th>
                <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Prix</th>
                <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Catégorie</th>
                <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Statut</th>
                <th className="text-right p-3 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3"><img src={p.image} alt="" className="w-12 h-12 object-cover rounded-lg" /></td>
                  <td className="p-3 text-foreground font-medium">{p.name}</td>
                  <td className="p-3 text-foreground hidden md:table-cell">{Number(p.price).toFixed(2)} DH</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{p.category}</td>
                  <td className="p-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.is_active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {p.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(p)} className="p-1.5 text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => del.mutate(p.id)} className="p-1.5 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
