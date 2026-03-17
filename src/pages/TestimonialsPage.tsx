import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const TestimonialsPage = () => {
  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((acc: number, t: any) => acc + (t.rating || 5), 0) / testimonials.length).toFixed(1)
      : "5.0";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Avis clients
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
              Ce que disent nos clients
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              Des milliers de sportifs font confiance à NutriTrax pour atteindre leurs objectifs.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-primary">{avgRating}</p>
                <div className="flex justify-center gap-0.5 my-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Note moyenne</p>
              </div>
              <div className="w-px h-16 bg-border hidden sm:block self-center" />
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-primary">{testimonials.length}+</p>
                <p className="text-sm text-muted-foreground mt-1">Avis vérifiés</p>
              </div>
              <div className="w-px h-16 bg-border hidden sm:block self-center" />
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground mt-1">Clients satisfaits</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-8 animate-pulse">
                  <div className="h-4 bg-muted rounded w-24 mb-4" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-4/5 mb-2" />
                  <div className="h-3 bg-muted rounded w-3/5 mb-6" />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted" />
                    <div>
                      <div className="h-3 bg-muted rounded w-24 mb-1" />
                      <div className="h-3 bg-muted rounded w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Aucun témoignage pour le moment.</p>
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t: any) => (
                <StaggerItem key={t.id}>
                  <div className="group bg-card border border-border rounded-xl p-8 hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
                    {/* Quote icon */}
                    <Quote className="w-8 h-8 text-primary/20 mb-4" />

                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_: any, j: number) => (
                        <Star
                          key={j}
                          className={`w-4 h-4 ${j < (t.rating || 5) ? "fill-accent text-accent" : "text-border"}`}
                        />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-foreground/80 leading-relaxed italic flex-1 mb-6">
                      "{t.content}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/10"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                          {t.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{t.name}</p>
                        {t.role && (
                          <p className="text-sm text-muted-foreground">{t.role}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection>
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Rejoignez notre communauté
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Découvrez nos produits premium et partagez votre expérience.
            </p>
            <a
              href="/boutique"
              className="inline-flex items-center px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Découvrir nos produits
            </a>
          </div>
        </section>
      </AnimatedSection>

      <Footer />
    </div>
  );
};

export default TestimonialsPage;
