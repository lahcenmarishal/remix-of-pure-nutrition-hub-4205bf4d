import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Eye, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { useState, useMemo } from "react";

const getSku = (item: any, productsBySlug: Record<string, string>) => {
  if (item?.sku) return item.sku;
  if (item?.id) return `PRD-${String(item.id).slice(0, 8).toUpperCase()}`;
  if (item?.product?.id) return `PRD-${String(item.product.id).slice(0, 8).toUpperCase()}`;
  if (item?.slug && productsBySlug[item.slug]) return productsBySlug[item.slug];
  return "—";
};

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const StatCard = ({ icon: Icon, label, value, color, active, onClick }: { icon: any; label: string; value: string | number; color: string; active?: boolean; onClick?: () => void }) => (
  <div onClick={onClick}
    className={`bg-card border rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all ${active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}`}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  </div>
);

const AdminOrders = () => {
  const qc = useQueryClient();
  const [detail, setDetail] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: products = [] } = useQuery({
    queryKey: ["admin-order-products-sku"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id, slug");
      if (error) throw error;
      return data;
    },
  });

  const productsBySlug = useMemo(
    () => Object.fromEntries(products.map((p: any) => [p.slug, `PRD-${p.id.slice(0, 8).toUpperCase()}`])),
    [products]
  );

  const stats = useMemo(() => {
    const revenue = orders.filter((o: any) => o.status !== "cancelled").reduce((s: number, o: any) => s + Number(o.total), 0);
    const pending = orders.filter((o: any) => o.status === "pending").length;
    const delivered = orders.filter((o: any) => o.status === "delivered").length;
    const cancelled = orders.filter((o: any) => o.status === "cancelled").length;
    return { total: orders.length, revenue, pending, delivered, cancelled };
  }, [orders]);

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Statut mis à jour" });
    },
  });

  if (detail) {
    const items = (detail.items as any[]) || [];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Commande #{detail.id.slice(0, 8)}</h2>
          <button onClick={() => setDetail(null)} className="text-sm text-muted-foreground hover:text-foreground">Retour</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-2">
            <h3 className="font-semibold text-foreground">Client</h3>
            <p className="text-sm text-foreground">{detail.customer_name}</p>
            <p className="text-sm text-muted-foreground">{detail.customer_email}</p>
            <p className="text-sm text-muted-foreground">{detail.customer_phone}</p>
            <p className="text-sm text-muted-foreground">{detail.shipping_address}</p>
          </div>
          <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-2">
            <h3 className="font-semibold text-foreground">Détails</h3>
            <p className="text-sm">Sous-total: <span className="font-medium">{Number(detail.subtotal).toFixed(2)} DH</span></p>
            <p className="text-sm">Livraison: <span className="font-medium">{Number(detail.shipping).toFixed(2)} DH</span></p>
            <p className="text-sm font-bold">Total: {Number(detail.total).toFixed(2)} DH</p>
            <div className="pt-2">
              <label className="block text-sm font-medium mb-1">Statut</label>
              <select value={detail.status}
                onChange={e => { updateStatus.mutate({ id: detail.id, status: e.target.value }); setDetail({ ...detail, status: e.target.value }); }}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm">
                {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50">
              <th className="text-left p-3 font-medium">Produit</th>
              <th className="text-left p-3 font-medium">SKU</th>
              <th className="text-left p-3 font-medium">Qté</th>
              <th className="text-right p-3 font-medium">Prix</th>
            </tr></thead>
            <tbody>
              {items.map((item: any, i: number) => (
                <tr key={i} className="border-t border-border">
                  <td className="p-3 text-foreground">{item.name || item.product?.name || "Produit"}</td>
                  <td className="p-3 text-muted-foreground font-mono text-xs">{getSku(item, productsBySlug)}</td>
                  <td className="p-3 text-foreground">{item.quantity}</td>
                  <td className="p-3 text-right text-foreground">{(Number(item.price || 0) * item.quantity).toFixed(2)} DH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Commandes</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard icon={ShoppingBag} label="Total commandes" value={stats.total} color="bg-primary/10 text-primary" active={statusFilter === null} onClick={() => setStatusFilter(null)} />
        <StatCard icon={DollarSign} label="Chiffre d'affaires" value={`${stats.revenue.toFixed(2)} DH`} color="bg-green-100 text-green-700" onClick={() => setStatusFilter(null)} />
        <StatCard icon={Clock} label="En attente" value={stats.pending} color="bg-yellow-100 text-yellow-700" active={statusFilter === "pending"} onClick={() => setStatusFilter(statusFilter === "pending" ? null : "pending")} />
        <StatCard icon={CheckCircle} label="Livrées" value={stats.delivered} color="bg-emerald-100 text-emerald-700" active={statusFilter === "delivered"} onClick={() => setStatusFilter(statusFilter === "delivered" ? null : "delivered")} />
        <StatCard icon={XCircle} label="Annulées" value={stats.cancelled} color="bg-red-100 text-red-700" active={statusFilter === "cancelled"} onClick={() => setStatusFilter(statusFilter === "cancelled" ? null : "cancelled")} />
      </div>

      {statusFilter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtre :</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[statusFilter]}`}>{statusLabels[statusFilter]}</span>
          <button onClick={() => setStatusFilter(null)} className="text-xs text-muted-foreground hover:text-foreground underline">Effacer</button>
        </div>
      )}

      {isLoading ? <p className="text-muted-foreground">Chargement...</p> : orders.filter((o: any) => !statusFilter || o.status === statusFilter).length === 0 ? (
        <p className="text-muted-foreground">{statusFilter ? "Aucune commande avec ce statut." : "Aucune commande pour le moment."}</p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50">
              <th className="text-left p-3 font-medium text-foreground">ID</th>
              <th className="text-left p-3 font-medium text-foreground">Client</th>
              <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Total</th>
              <th className="text-left p-3 font-medium text-foreground">Statut</th>
              <th className="text-left p-3 font-medium text-foreground hidden md:table-cell">Date</th>
              <th className="text-right p-3 font-medium text-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {orders.filter((o: any) => !statusFilter || o.status === statusFilter).map((o: any) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="p-3 text-foreground font-mono text-xs">#{o.id.slice(0, 8)}</td>
                  <td className="p-3 text-foreground">{o.customer_name}</td>
                  <td className="p-3 text-foreground hidden md:table-cell">{Number(o.total).toFixed(2)} DH</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[o.status] || ""}`}>
                      {statusLabels[o.status] || o.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell text-xs">{new Date(o.created_at).toLocaleDateString("fr-FR")}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => setDetail(o)} className="p-1.5 text-muted-foreground hover:text-foreground"><Eye className="w-4 h-4" /></button>
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

export default AdminOrders;
