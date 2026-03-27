import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/hooks/useProducts";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, GripVertical, ChevronUp, ChevronDown, Star, Upload, X } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { uploadImage } from "@/lib/uploadImage";

const slugify = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyProduct = {
  name: "", price: 0, original_price: null as number | null,
  image: "", images: [] as string[], category: "", badge: null as string | null,
  promo_label: null as string | null,
  short_description: "", description: "",
  benefits: [] as string[], ingredients: [] as any[], faq: [] as any[],
  is_active: true, rating: 0, reviews: 0,
  shipping_price: null as number | null,
  expiration_date: null as string | null,
  barcode: null as string | null,
  sort_order: 0,
};

const AdminProducts = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ ...emptyProduct });
  const [catQuery, setCatQuery] = useState("");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const { data: categories = [] } = useCategories();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*")
        .order("sort_order", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (p: typeof form & { id?: string }) => {
      const slug = slugify(p.name);
      const payload = {
        name: p.name, slug, price: p.price, original_price: p.original_price,
        image: p.image, images: p.images, category: p.category, badge: p.badge,
        promo_label: p.promo_label,
        short_description: p.short_description, description: p.description,
        benefits: p.benefits, ingredients: p.ingredients, faq: p.faq,
        is_active: p.is_active, rating: p.rating, reviews: p.reviews,
        shipping_price: p.shipping_price,
        expiration_date: p.expiration_date,
        barcode: p.barcode || null,
        sort_order: p.sort_order,
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

  const reorder = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase.from("products").update({ sort_order: newOrder }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const moveProduct = (index: number, direction: "up" | "down") => {
    const sorted = [...products];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const currentOrder = sorted[index].sort_order ?? 0;
    const swapOrder = sorted[swapIdx].sort_order ?? 0;
    reorder.mutate({ id: sorted[index].id, newOrder: swapOrder });
    reorder.mutate({ id: sorted[swapIdx].id, newOrder: currentOrder });
  };

  const startEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, price: Number(p.price), original_price: p.original_price ? Number(p.original_price) : null,
      image: p.image, images: p.images || [], category: p.category, badge: p.badge,
      promo_label: p.promo_label || null,
      short_description: p.short_description || "", description: p.description || "",
      benefits: p.benefits || [], ingredients: p.ingredients || [], faq: p.faq || [],
      is_active: p.is_active, rating: Number(p.rating), reviews: p.reviews,
      shipping_price: p.shipping_price != null ? Number(p.shipping_price) : null,
      expiration_date: p.expiration_date || null,
      barcode: p.barcode || null,
      sort_order: p.sort_order ?? 0,
    });
    setCatQuery(categories.find((c: any) => c.id === p.category)?.label || p.category || "");
  };

  const startNew = () => {
    setEditing({});
    setForm({ ...emptyProduct });
    setCatQuery("");
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setGalleryUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadImage(file, "products");
        urls.push(url);
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err: any) {
      toast({ title: "Erreur d'upload", description: err.message, variant: "destructive" });
    }
    setGalleryUploading(false);
    if (galleryRef.current) galleryRef.current.value = "";
  };

  const removeGalleryImage = (index: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
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
            <p className="text-xs text-muted-foreground mt-1">Slug auto : <code className="bg-muted px-1 rounded">{slugify(form.name) || "—"}</code></p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Prix (DH)</label>
            <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Prix barré</label>
            <input type="number" step="0.01" value={form.original_price ?? ""} onChange={e => setForm({ ...form, original_price: e.target.value ? Number(e.target.value) : null })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Frais livraison (DH)</label>
            <input type="number" step="0.01" value={form.shipping_price ?? ""} onChange={e => setForm({ ...form, shipping_price: e.target.value ? Number(e.target.value) : null })}
              placeholder="Laisser vide = prix global"
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-foreground mb-1">Catégorie</label>
            <input value={catQuery} onChange={e => {
              setCatQuery(e.target.value);
              setShowCatDropdown(true);
              const match = categories.find((c: any) => c.label.toLowerCase() === e.target.value.toLowerCase());
              setForm({ ...form, category: match ? match.id : "" });
            }}
              onFocus={() => setShowCatDropdown(true)}
              onBlur={() => setTimeout(() => setShowCatDropdown(false), 200)}
              placeholder="Tapez pour rechercher..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
            {showCatDropdown && categories.filter((c: any) => c.label.toLowerCase().includes(catQuery.toLowerCase())).length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {categories.filter((c: any) => c.label.toLowerCase().includes(catQuery.toLowerCase())).map((cat: any) => (
                  <button key={cat.id} type="button"
                    onMouseDown={() => { setForm({ ...form, category: cat.id }); setCatQuery(cat.label); setShowCatDropdown(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Promo / Offre exclusive</label>
            <input value={form.promo_label || ""} onChange={e => setForm({ ...form, promo_label: e.target.value || null })}
              placeholder="Ex: -30%, Offre spéciale, Pack duo..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Date d'expiration</label>
            <input type="date" value={form.expiration_date || ""} onChange={e => setForm({ ...form, expiration_date: e.target.value || null })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Code-barres</label>
            <input value={form.barcode || ""} onChange={e => setForm({ ...form, barcode: e.target.value || null })}
              placeholder="EAN-13, UPC..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
          {/* Rating & reviews */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Note (étoiles)</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })}
                  className="p-0.5">
                  <Star className={`w-6 h-6 ${star <= form.rating ? "fill-accent text-accent" : "text-border"}`} />
                </button>
              ))}
              <input type="number" step="0.1" min="0" max="5" value={form.rating}
                onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                className="w-16 ml-2 px-2 py-1 border border-border rounded-lg bg-background text-foreground text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombre d'avis</label>
            <input type="number" value={form.reviews} onChange={e => setForm({ ...form, reviews: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          </div>
        </div>

        {/* Main image */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Image principale</label>
          <ImageUpload value={form.image} onChange={url => setForm({ ...form, image: url })} />
          {!form.image && (
            <input placeholder="Ou URL directe" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
              className="w-full mt-2 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm" />
          )}
        </div>

        {/* Gallery */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Galerie d'images</label>
          <div className="flex gap-2 flex-wrap">
            {form.images.map((url, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeGalleryImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => galleryRef.current?.click()} disabled={galleryUploading}
              className="w-24 h-24 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors">
              <Upload className="w-5 h-5 mb-1" />
              <span className="text-xs">{galleryUploading ? "Upload..." : "Ajouter"}</span>
            </button>
          </div>
          <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
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
          <textarea value={form.benefits.join("\n")} onChange={e => setForm({ ...form, benefits: e.target.value.split("\n") })}
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
                <th className="text-left p-3 font-medium text-foreground w-10">Ordre</th>
                <th className="text-left p-3 font-medium text-foreground">Image</th>
                <th className="text-left p-3 font-medium text-foreground">Nom</th>
                <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">SKU</th>
                <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Prix</th>
                <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Note</th>
                <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Statut</th>
                <th className="text-right p-3 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any, idx: number) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-2">
                    <div className="flex flex-col items-center gap-0.5">
                      <button onClick={() => moveProduct(idx, "up")} disabled={idx === 0}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                      <button onClick={() => moveProduct(idx, "down")} disabled={idx === products.length - 1}
                        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="p-3"><img src={p.image} alt="" className="w-12 h-12 object-cover rounded-lg" /></td>
                  <td className="p-3 text-foreground font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground font-mono text-xs hidden md:table-cell">{p.barcode || "—"}</td>
                  <td className="p-3 text-foreground hidden md:table-cell">{Number(p.price).toFixed(2)} DH</td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      <span className="text-foreground text-xs">{Number(p.rating).toFixed(1)} ({p.reviews})</span>
                    </div>
                  </td>
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
