import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

const empty = { title: "", slug: "", excerpt: "", content: "", image: "", category: "", author: "", is_published: false };

const AdminBlog = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ ...empty });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (p: typeof form & { id?: string }) => {
      const payload = {
        title: p.title, slug: p.slug, excerpt: p.excerpt, content: p.content,
        image: p.image, category: p.category, author: p.author, is_published: p.is_published,
        published_at: p.is_published ? new Date().toISOString() : null,
      };
      if (p.id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); setEditing(null); toast({ title: "Article sauvegardé !" }); },
    onError: (e: any) => toast({ title: "Erreur", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("blog_posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-blog"] }); toast({ title: "Supprimé" }); },
  });

  if (editing !== null) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">{editing.id ? "Modifier" : "Nouvel"} article</h2>
          <button onClick={() => setEditing(null)} className="text-sm text-muted-foreground hover:text-foreground">Annuler</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Titre</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Slug</label>
            <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Catégorie</label>
            <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Auteur</label>
            <input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Image</label>
          <ImageUpload value={form.image} onChange={url => setForm({ ...form, image: url })} folder="blog" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Extrait</label>
          <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Contenu</label>
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={8} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_published} onChange={e => setForm({ ...form, is_published: e.target.checked })} />
          <label className="text-sm text-foreground">Publié</label>
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
        <h2 className="font-display text-xl font-bold text-foreground">Blog ({posts.length})</h2>
        <button onClick={() => { setEditing({}); setForm({ ...empty }); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>
      {isLoading ? <p className="text-muted-foreground">Chargement...</p> : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50">
              <th className="text-left p-3 font-medium text-foreground">Titre</th>
              <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Catégorie</th>
              <th className="text-left p-3 font-medium text-foreground">Statut</th>
              <th className="text-right p-3 font-medium text-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {posts.map((p: any) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3 text-foreground font-medium">{p.title}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{p.category}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.is_published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {p.is_published ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditing(p); setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt || "", content: p.content || "", image: p.image || "", category: p.category || "", author: p.author || "", is_published: p.is_published }); }} className="p-1.5 text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
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

export default AdminBlog;
