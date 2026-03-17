import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Truck, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "@/hooks/use-toast";

const cities = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès",
  "Oujda", "Kénitra", "Tétouan", "Salé", "Nador", "Mohammedia", "El Jadida",
  "Béni Mellal", "Taza", "Khouribga", "Settat", "Laâyoune", "Dakhla",
];

const CheckoutPage = () => {
  const { items, subtotal, shippingCost, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "Casablanca",
    zip: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const orderItems = items.map(i => ({
      name: i.product.name,
      slug: i.product.slug,
      price: i.product.price,
      quantity: i.quantity,
      image: i.product.image,
    }));

    const { error } = await supabase.from("orders").insert({
      customer_name: `${form.firstName} ${form.lastName}`,
      customer_email: form.email || "",
      customer_phone: form.phone,
      shipping_address: `${form.address}, ${form.city} ${form.zip}`,
      items: orderItems,
      subtotal: subtotal,
      shipping: shippingCost,
      total: total,
    });

    if (error) {
      toast({ title: "Erreur", description: "Impossible de passer la commande.", variant: "destructive" });
      return;
    }

    setSubmitted(true);
    clearCart();
    toast({
      title: "Commande confirmée !",
      description: "Vous recevrez un appel de confirmation sous 24h.",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-lg text-center py-20">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Merci pour votre commande !
            </h1>
            <p className="text-muted-foreground mb-2">
              Votre commande a été enregistrée avec succès.
            </p>
            <p className="text-muted-foreground mb-8">
              Vous recevrez un appel de confirmation sous 24h pour valider votre livraison.
            </p>
            <div className="bg-muted/50 border border-border rounded-xl p-6 mb-8 text-left space-y-2">
              <p className="text-sm"><span className="font-medium text-foreground">Nom :</span> <span className="text-muted-foreground">{form.firstName} {form.lastName}</span></p>
              <p className="text-sm"><span className="font-medium text-foreground">Téléphone :</span> <span className="text-muted-foreground">{form.phone}</span></p>
              <p className="text-sm"><span className="font-medium text-foreground">Ville :</span> <span className="text-muted-foreground">{form.city}</span></p>
              <p className="text-sm"><span className="font-medium text-foreground">Adresse :</span> <span className="text-muted-foreground">{form.address}</span></p>
            </div>
            <Link
              to="/boutique"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
            >
              Continuer mes achats
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">Votre panier est vide</h1>
            <Link to="/boutique" className="text-primary hover:underline">Retour à la boutique</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">Validation de commande</span>
          </nav>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
            Validation de commande
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-5">
                  Informations de livraison
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Prénom *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={form.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={form.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Téléphone *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="06XXXXXXXX"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Adresse complète *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Ville *</label>
                    <select
                      name="city"
                      required
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Code postal</label>
                    <input
                      type="text"
                      name="zip"
                      value={form.zip}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Mode de paiement
                </h2>
                <div className="flex items-center gap-3 p-4 bg-muted/50 border border-primary/20 rounded-lg">
                  <div className="w-4 h-4 rounded-full border-4 border-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Paiement à la livraison</p>
                    <p className="text-xs text-muted-foreground">Payez en espèces à la réception de votre commande</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
              >
                Confirmer ma commande — {total.toFixed(2)} DH
              </button>
            </form>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-28">
                <h2 className="font-display text-xl font-semibold text-foreground mb-5">
                  Récapitulatif
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qté : {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground whitespace-nowrap">
                        {(item.product.price * item.quantity).toFixed(2)} DH
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Livraison
                    </span>
                    <span className={shippingCost === 0 ? "text-green-600 font-medium" : "text-foreground"}>
                      {shippingCost === 0 ? "Gratuite" : `${shippingCost.toFixed(2)} DH`}
                    </span>
                  </div>
                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Livraison gratuite dès 500 DH d'achat
                    </p>
                  )}
                  <div className="flex justify-between text-lg font-bold text-foreground pt-3 border-t border-border">
                    <span>Total</span>
                    <span>{total.toFixed(2)} DH</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="w-4 h-4 text-primary" />
                    <span>Livraison partout au Maroc (2-5 jours)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span>Paiement sécurisé à la livraison</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
