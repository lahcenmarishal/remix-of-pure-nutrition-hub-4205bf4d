import { Star } from "lucide-react";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const testimonials = [
  {
    name: "Karim B.",
    text: "La Whey Protein Isolate NutriTrax est la meilleure que j'ai testée. Goût excellent et résultats visibles en 3 semaines.",
    rating: 5,
    role: "Athlète CrossFit",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
  },
  {
    name: "Fatima Z.",
    text: "J'adore les Omega-3 Premium. Qualité irréprochable, pas d'arrière-goût de poisson. Je recommande à 100%.",
    rating: 5,
    role: "Coach sportive",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
  },
  {
    name: "Youssef A.",
    text: "Livraison ultra rapide et service client au top. Les produits sont d'une qualité qu'on ne trouve nulle part ailleurs.",
    rating: 5,
    role: "Bodybuilder amateur",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
  },
];

const Testimonials = () => (
  <section className="py-20 lg:py-28">
    <div className="container mx-auto px-4">
      <AnimatedSection className="text-center mb-14">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Ce que disent nos clients</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Des milliers de sportifs font confiance à NutriTrax.</p>
      </AnimatedSection>
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <StaggerItem key={i}>
            <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow h-full">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  </section>
);

export default Testimonials;
