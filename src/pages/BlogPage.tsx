import { Link } from "react-router-dom";
import { ArrowRight, Clock, Calendar, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import blogHero from "@/assets/blog-hero.jpg";

const BlogPage = () => {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <img src={blogHero} alt="Blog NutriTrax" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
          </div>
          <div className="relative z-10 container mx-auto px-4 py-20 text-center">
            <AnimatedSection>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6">Blog & Conseils</h1>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Articles d'experts, guides pratiques et dernières actualités en nutrition sportive.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Articles */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl overflow-hidden border border-border animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 bg-muted rounded w-1/4" />
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article: any) => {
                  const wordCount = article.content ? article.content.replace(/<[^>]*>/g, "").split(/\s+/).length : 0;
                  const readTime = Math.max(1, Math.ceil(wordCount / 200));
                  const formattedDate = article.published_at
                    ? new Date(article.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })
                    : "";

                  return (
                    <StaggerItem key={article.id}>
                      <Link to={`/blog/${article.slug}`} className="group block h-full">
                        <article className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={article.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80"}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {article.category && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent uppercase tracking-wider">
                                  <Tag className="w-3 h-3" /> {article.category}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {readTime} min
                              </span>
                            </div>
                            <h2 className="font-display text-xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                              {article.title}
                            </h2>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1 line-clamp-3">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center justify-between">
                              {formattedDate && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Calendar className="w-3 h-3" /> {formattedDate}
                                </p>
                              )}
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-accent transition-colors ml-auto">
                                Lire <ArrowRight className="w-4 h-4" />
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
