import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Trash2, Tag } from "lucide-react";

const AdminCategories = () => {
  const qc = useQueryClient();
  const [newId, setNewId] = useState("");
  const [newLabel, setNewLabel] = useState("");

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("label");
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      const slug = newId.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      if (!slug || !newLabel.trim()) throw new Error("ID et libellé requis");
      const { error } = await supabase.from("categories").insert({ id: slug, label: newLabel.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      setNewId(""); setNewLabel("");
      toast({ title: "Catégorie ajoutée !" });
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Catégorie supprimée" });
    },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="font-display text-xl font-bold text-foreground">Catégories ({categories.length})</h2>

      {/* Add form */}
      <div className="bg-card border border-border rounded-xl p-4 flex gap-3 flex-wrap items-end">
        <div className="flex-1 min-w-36">
          <label className="block text-xs font-medium text-muted-foreground mb-1">Slug (ID)</label>
          <input value={newId} onChange={e => setNewId(e.target.value)}
            placeholder="ex: proteines"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
        </div>
        <div className="flex-1 min-w-36">
          <label className="block text-xs font-medium text-muted-foreground mb-1">Libellé</label>
          <input value={newLabel} onChange={e => setNewLabel(e.target.value)}
            placeholder="ex: Protéines"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
        </div>
        <button onClick={() => add.mutate()} disabled={add.isPending || !newId || !newLabel}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* List */}
      {isLoading ? <p className="text-muted-foreground text-sm">Chargement...</p> : (
        <div className="border border-border rounded-xl overflow-hidden">
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">Aucune catégorie</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-3 font-medium text-foreground">Slug</th>
                  <th className="text-left p-3 font-medium text-foreground">Libellé</th>
                  <th className="text-right p-3 font-medium text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat: any) => (
                  <tr key={cat.id} className="border-t border-border">
                    <td className="p-3 font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" /> {cat.id}
                    </td>
                    <td className="p-3 text-foreground font-medium">{cat.label}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => del.mutate(cat.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
