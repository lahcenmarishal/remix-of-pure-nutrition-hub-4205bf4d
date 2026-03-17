import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Clock, Calendar, User, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["blog-related", post?.category, slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, image, published_at, category")
        .eq("is_published", true)
        .eq("category", post!.category)
        .neq("slug", slug!)
        .limit(3);
      return data || [];
    },
    enabled: !!post?.category,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-3xl py-20 text-center">
            <div className="space-y-4 animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
              <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
              <div className="h-64 bg-muted rounded-xl mt-8" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="font-display text-2xl font-bold text-foreground mb-4">Article introuvable</h1>
            <p className="text-muted-foreground mb-6">Cet article n'existe pas ou n'est plus disponible.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
              <ArrowLeft className="w-4 h-4" /> Retour au blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    : "";

  // Estimate read time (avg 200 words/min)
  const wordCount = post.content ? post.content.replace(/<[^>]*>/g, "").split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        {/* Hero image */}
        {post.image && (
          <div className="relative h-72 md:h-96 lg:h-[480px] overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
        )}

        <div className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mt-8 mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
          </nav>

          <AnimatedSection>
            {/* Category & meta */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.category && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent uppercase tracking-wider bg-accent/10 px-3 py-1 rounded-full">
                  <Tag className="w-3 h-3" /> {post.category}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> {readTime} min de lecture
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author & date */}
            <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-border mb-10">
              {post.author && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{post.author}</span>
                </div>
              )}
              {formattedDate && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </div>
              )}
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground font-medium mb-8 leading-relaxed border-l-4 border-primary pl-4 italic">
                {post.excerpt}
              </p>
            )}

            {/* Content */}
            {post.content && (
              <div
                className="prose prose-neutral max-w-none
                  prose-headings:font-display prose-headings:text-foreground prose-headings:font-bold
                  prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
                  prose-strong:text-foreground
                  prose-ul:text-muted-foreground prose-ul:space-y-1
                  prose-li:text-muted-foreground
                  prose-a:text-primary hover:prose-a:text-accent"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}

            {/* Back button */}
            <div className="mt-14 pt-8 border-t border-border">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour au blog
              </Link>
            </div>
          </AnimatedSection>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <section className="mt-20 py-16 bg-muted/40 border-t border-border">
            <div className="container mx-auto px-4">
              <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">Articles similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {related.map((rel: any) => (
                  <Link
                    key={rel.id}
                    to={`/blog/${rel.slug}`}
                    className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
                  >
                    {rel.image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={rel.image}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {rel.category && (
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">{rel.category}</span>
                      )}
                      <h3 className="font-display text-base font-semibold text-card-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">
                        {rel.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPostPage;
