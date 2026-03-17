import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import blogHero from "@/assets/blog-hero.jpg";

const articles = [
  {
    title: "Les 5 suppléments essentiels pour les sportifs",
    excerpt: "Découvrez quels compléments alimentaires peuvent réellement améliorer vos performances et accélérer votre récupération.",
    date: "28 Fév 2026",
    readTime: "5 min",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80",
  },
  {
    title: "Guide complet de la créatine",
    excerpt: "Tout ce que vous devez savoir sur le supplément le plus étudié au monde : dosage, timing, et résultats attendus.",
    date: "15 Fév 2026",
    readTime: "8 min",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  },
  {
    title: "Nutrition et récupération : les clés du succès",
    excerpt: "Comment optimiser votre alimentation pour maximiser votre récupération musculaire après un entraînement intensif.",
    date: "3 Fév 2026",
    readTime: "6 min",
    category: "Récupération",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
  },
  {
    title: "Protéines végétales vs animales : le comparatif",
    excerpt: "Analyse détaillée des deux sources de protéines pour vous aider à faire le meilleur choix selon vos objectifs.",
    date: "20 Jan 2026",
    readTime: "7 min",
    category: "Nutrition",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  },
  {
    title: "Comment booster son immunité naturellement",
    excerpt: "Les compléments et habitudes qui renforcent vos défenses naturelles, surtout pendant les saisons froides.",
    date: "10 Jan 2026",
    readTime: "4 min",
    category: "Immunité",
    image: "https://images.unsplash.com/photo-1505576399279-0d309ead8e94?w=600&q=80",
  },
  {
    title: "Pré-workout : mythe ou réalité ?",
    excerpt: "On décortique les ingrédients des pré-workouts pour séparer le marketing de la science.",
    date: "28 Déc 2025",
    readTime: "6 min",
    category: "Guides",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80",
  },
];

const BlogPage = () => (
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
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <StaggerItem key={i}>
                <article className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">{article.category}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {article.readTime}
                      </span>
                    </div>
                    <h2 className="font-display text-xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{article.date}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent transition-colors cursor-pointer">
                        Lire <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default BlogPage;
