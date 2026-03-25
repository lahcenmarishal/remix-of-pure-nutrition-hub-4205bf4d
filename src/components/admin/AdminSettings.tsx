import { useState, useEffect, useCallback } from "react";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { toast } from "@/hooks/use-toast";
import { Save, Phone, Mail, MapPin, Facebook, Instagram, Video, Youtube, Truck, type LucideIcon } from "lucide-react";

type SettingsForm = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  shipping_price: number;
  free_shipping_threshold: number;
};

type SettingsFieldProps = {
  label: string;
  name: keyof SettingsForm;
  type?: "text" | "email" | "number";
  icon: LucideIcon;
  placeholder?: string;
  value: string | number;
  onChange: (name: keyof SettingsForm, value: string | number) => void;
};

const SettingsField = ({
  label,
  name,
  type = "text",
  icon: Icon,
  placeholder,
  value,
  onChange,
}: SettingsFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-1 flex items-center gap-1.5">
      <Icon className="w-4 h-4 text-muted-foreground" /> {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(name, type === "number" ? Number(e.target.value) : e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
    />
  </div>
);

const AdminSettings = () => {
  const { data: settings, isLoading } = useSettings();
  const update = useUpdateSettings();

  const [form, setForm] = useState<SettingsForm>({
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    facebook: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    shipping_price: 0,
    free_shipping_threshold: 0,
  });

  useEffect(() => {
    if (settings) {
      setForm({
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        email: settings.email || "",
        address: settings.address || "",
        facebook: settings.facebook || "",
        instagram: settings.instagram || "",
        tiktok: settings.tiktok || "",
        youtube: settings.youtube || "",
        shipping_price: settings.shipping_price ?? 0,
        free_shipping_threshold: settings.free_shipping_threshold ?? 0,
      });
    }
  }, [settings]);

  const handleChange = useCallback((name: keyof SettingsForm, value: string | number) => {
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update.mutate(form, {
      onSuccess: () => toast({ title: "Paramètres sauvegardés !" }),
      onError: (err: any) => toast({ title: "Erreur", description: err.message, variant: "destructive" }),
    });
  };

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Paramètres du site</h2>
        <button type="submit" disabled={update.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Save className="w-4 h-4" />
          {update.isPending ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>

      {/* Contact */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Coordonnées</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Téléphone" name="phone" icon={Phone} placeholder="+212 6XX XXX XXX" value={form.phone} onChange={handleChange} />
          <SettingsField label="WhatsApp" name="whatsapp" icon={Phone} placeholder="+212 6XX XXX XXX" value={form.whatsapp} onChange={handleChange} />
          <SettingsField label="Email" name="email" type="email" icon={Mail} placeholder="contact@nutritrax.ma" value={form.email} onChange={handleChange} />
        </div>
        <SettingsField label="Adresse" name="address" icon={MapPin} placeholder="123 Rue exemple, Casablanca" value={form.address} onChange={handleChange} />
      </div>

      {/* Social media */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Réseaux sociaux</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Facebook" name="facebook" icon={Facebook} placeholder="https://facebook.com/..." value={form.facebook} onChange={handleChange} />
          <SettingsField label="Instagram" name="instagram" icon={Instagram} placeholder="https://instagram.com/..." value={form.instagram} onChange={handleChange} />
          <SettingsField label="TikTok" name="tiktok" icon={Video} placeholder="https://tiktok.com/@..." value={form.tiktok} onChange={handleChange} />
          <SettingsField label="YouTube" name="youtube" icon={Youtube} placeholder="https://youtube.com/..." value={form.youtube} onChange={handleChange} />
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-foreground text-sm uppercase tracking-wide">Livraison</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="Frais de livraison (DH)" name="shipping_price" type="number" icon={Truck} placeholder="0" value={form.shipping_price} onChange={handleChange} />
          <SettingsField label="Livraison gratuite dès (DH)" name="free_shipping_threshold" type="number" icon={Truck} placeholder="500" value={form.free_shipping_threshold} onChange={handleChange} />
        </div>
        <p className="text-xs text-muted-foreground">Le frais de livraison global s'applique si le produit n'a pas de frais spécifique.</p>
      </div>
    </form>
  );
};

export default AdminSettings;
