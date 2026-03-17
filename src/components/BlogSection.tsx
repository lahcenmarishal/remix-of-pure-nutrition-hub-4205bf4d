import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const BlogSection = () => {
  const { data: posts = [] } = useQuery({
    queryKey: ["blog-posts-home"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(3);
      if (error) throw error;
      return data;
    },
  });

  // Fallback hardcoded
  const items = posts.length > 0 ? posts.map((p: any) => ({
    title: p.title, excerpt: p.excerpt || "",
    date: p.published_at ? new Date(p.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "",
    image: p.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
  })) : [
    { title: "Les 5 suppléments essentiels pour les sportifs", excerpt: "Découvrez quels compléments alimentaires peuvent réellement améliorer vos performances.", date: "28 Fév 2026", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80" },
    { title: "Guide complet de la créatine", excerpt: "Tout ce que vous devez savoir sur le supplément le plus étudié au monde.", date: "15 Fév 2026", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80" },
    { title: "Nutrition et récupération : les clés du succès", excerpt: "Comment optimiser votre alimentation pour maximiser votre récupération musculaire.", date: "3 Fév 2026", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Conseils & Blog</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Restez informé avec nos articles d'experts en nutrition sportive.</p>
        </AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((post: any, i: number) => (
            <StaggerItem key={i}>
              <article className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow h-full">
                <div className="aspect-video overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground mb-2">{post.date}</p>
                  <h3 className="font-display text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{post.excerpt}</p>
                  <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors">
                    Lire la suite <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default BlogSection;
