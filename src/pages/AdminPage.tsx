import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, Link } from "react-router-dom";
import { Package, ShoppingBag, MessageSquare, FileText, LogOut, Home, Settings, Tag, Megaphone } from "lucide-react";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminTestimonials from "@/components/admin/AdminTestimonials";
import AdminBlog from "@/components/admin/AdminBlog";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminPromos from "@/components/admin/AdminPromos";

const tabs = [
  { id: "products", label: "Produits", icon: Package },
  { id: "orders", label: "Commandes", icon: ShoppingBag },
  { id: "testimonials", label: "Témoignages", icon: MessageSquare },
  { id: "blog", label: "Blog", icon: FileText },
  { id: "promos", label: "Promos", icon: Megaphone },
  { id: "categories", label: "Catégories", icon: Tag },
  { id: "settings", label: "Paramètres", icon: Settings },
];

const AdminPage = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const [active, setActive] = useState("products");

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Chargement...</p></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-destructive font-semibold mb-2">Accès refusé</p>
        <p className="text-muted-foreground text-sm">Vous n'avez pas les droits d'administrateur.</p>
        <Link to="/" className="text-primary text-sm mt-4 inline-block hover:underline">Retour au site</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-60 bg-card border-r border-border hidden lg:flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="font-display text-lg font-bold text-foreground">NutriTrax Admin</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <Link to="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <Home className="w-4 h-4" /> Voir le site
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-destructive">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-50 bg-card border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display text-lg font-bold text-foreground">Admin</h1>
          <button onClick={signOut} className="text-sm text-muted-foreground"><LogOut className="w-4 h-4" /></button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                active === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="lg:ml-60 p-4 lg:p-8">
        {active === "products" && <AdminProducts />}
        {active === "orders" && <AdminOrders />}
        {active === "testimonials" && <AdminTestimonials />}
        {active === "blog" && <AdminBlog />}
        {active === "promos" && <AdminPromos />}
        {active === "categories" && <AdminCategories />}
        {active === "settings" && <AdminSettings />}
      </div>
    </div>
  );
};

export default AdminPage;
