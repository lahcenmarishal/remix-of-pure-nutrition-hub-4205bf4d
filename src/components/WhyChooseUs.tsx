import { Shield, FlaskConical, Truck, CreditCard } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const features = [
  { icon: Shield, title: "Qualité premium", desc: "Ingrédients de grade pharmaceutique, sourcés avec exigence." },
  { icon: FlaskConical, title: "Tests laboratoire", desc: "Chaque lot est analysé par un laboratoire indépendant certifié." },
  { icon: Truck, title: "Livraison rapide", desc: "Expédition sous 24h, livraison gratuite dès 500 DH d'achat." },
  { icon: CreditCard, title: "Paiement sécurisé", desc: "Transactions cryptées SSL. Paiement à la livraison accepté." },
];

const WhyChooseUs = () => (
  <section className="py-20 lg:py-28 bg-muted/50">
    <div className="container mx-auto px-4">
      <AnimatedSection className="text-center mb-14">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Pourquoi nous choisir</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">NutriTrax s'engage pour l'excellence à chaque étape.</p>
      </AnimatedSection>
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <StaggerItem key={i}>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

export default WhyChooseUs;
