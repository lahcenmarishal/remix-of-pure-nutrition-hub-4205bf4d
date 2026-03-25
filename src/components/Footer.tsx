import { Link } from "react-router-dom";
import { useSettings } from "@/hooks/useSettings";
import { Facebook, Instagram, Youtube } from "lucide-react";
import logo from "@/assets/nutritrax-logo.png";

const Footer = () => {
  const { data: settings } = useSettings();

  return (
    <footer className="bg-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <img src={logo} alt="NutriTrax" className="h-14 w-auto mb-4" />
            <p className="text-sm text-background/60 leading-relaxed">
              NutriTrax Nutrition — L'excellence en nutrition sportive depuis 2020.
            </p>
            {/* Social links */}
            {settings && (
              <div className="flex gap-3 mt-4">
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-accent transition-colors">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-accent transition-colors">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings.youtube && (
                  <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-accent transition-colors">
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
                {settings.tiktok && (
                  <a href={settings.tiktok} target="_blank" rel="noopener noreferrer" className="text-background/50 hover:text-accent transition-colors text-xs font-bold">
                    TT
                  </a>
                )}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Boutique</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><Link to="/boutique" className="hover:text-accent transition-colors">Tous les produits</Link></li>
              <li><Link to="/boutique" className="hover:text-accent transition-colors">Prise de masse</Link></li>
              <li><Link to="/boutique" className="hover:text-accent transition-colors">Énergie</Link></li>
              <li><Link to="/boutique" className="hover:text-accent transition-colors">Immunité</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Informations</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li><Link to="/a-propos" className="hover:text-accent transition-colors">À propos</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
              <li><span className="hover:text-accent transition-colors cursor-pointer">CGV</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-background mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-background/60">
              <li>{settings?.email || "contact@nutritrax.ma"}</li>
              <li>{settings?.phone || "+212 5 22 00 00 00"}</li>
              <li>{settings?.address || "Casablanca, Maroc"}</li>
              {settings?.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent transition-colors"
                  >
                    WhatsApp: {settings.whatsapp}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="border-t border-background/10 pt-8 text-center text-xs text-background/40">
          © 2026 NutriTrax Nutrition. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
