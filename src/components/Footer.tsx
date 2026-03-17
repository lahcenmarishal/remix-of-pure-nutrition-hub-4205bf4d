import { Link } from "react-router-dom";
import logo from "@/assets/nutritrax-logo.png";

const Footer = () => (
  <footer className="bg-foreground py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <img src={logo} alt="NutriTrax" className="h-14 w-auto mb-4" />
          <p className="text-sm text-background/60 leading-relaxed">
            NutriTrax Nutrition — L'excellence en nutrition sportive depuis 2020.
          </p>
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
            <li>contact@nutritrax.ma</li>
            <li>+212 5 22 00 00 00</li>
            <li>Casablanca, Maroc</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 pt-8 text-center text-xs text-background/40">
        © 2026 NutriTrax Nutrition. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
