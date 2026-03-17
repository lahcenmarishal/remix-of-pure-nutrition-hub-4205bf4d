import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const Testimonials = () => {
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(6);
      if (error) throw error;
      return data;
    },
  });

  // Fallback hardcoded if no DB data yet
  const items = testimonials.length > 0 ? testimonials : [
    { id: "1", name: "Karim B.", content: "La Whey Protein Isolate NutriTrax est la meilleure que j'ai testée.", rating: 5, role: "Athlète CrossFit", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" },
    { id: "2", name: "Fatima Z.", content: "J'adore les Omega-3 Premium. Qualité irréprochable.", rating: 5, role: "Coach sportive", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" },
    { id: "3", name: "Youssef A.", content: "Livraison ultra rapide et service client au top.", rating: 5, role: "Bodybuilder amateur", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80" },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Ce que disent nos clients</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Des milliers de sportifs font confiance à NutriTrax.</p>
        </AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.slice(0, 3).map((t: any) => (
            <StaggerItem key={t.id}>
              <div className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_: any, j: number) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-6 leading-relaxed italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  {t.avatar && <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />}
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
};

export default Testimonials;
