import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { Shield, Award, Users, Heart } from "lucide-react";
import aboutLab from "@/assets/about-lab.jpg";
import aboutTeam from "@/assets/about-team.jpg";

const values = [
  { icon: Shield, title: "Qualité", desc: "Chaque ingrédient est sélectionné avec la plus grande rigueur et testé en laboratoire indépendant." },
  { icon: Award, title: "Excellence", desc: "Nos formulations sont conçues par des experts en nutrition et validées scientifiquement." },
  { icon: Users, title: "Communauté", desc: "Plus de 15 000 sportifs marocains nous font confiance au quotidien." },
  { icon: Heart, title: "Passion", desc: "Nous sommes des passionnés de sport et de nutrition, engagés pour votre réussite." },
];

const milestones = [
  { year: "2020", event: "Création de NutriTrax à Casablanca" },
  { year: "2021", event: "Lancement de notre gamme protéines premium" },
  { year: "2022", event: "10 000 clients satisfaits au Maroc" },
  { year: "2023", event: "Certification qualité ISO et ouverture de notre propre laboratoire" },
  { year: "2024", event: "Extension nationale — livraison dans tout le Maroc" },
  { year: "2025", event: "Partenariats avec des athlètes de haut niveau" },
];

const AboutPage = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main>
      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutLab} alt="Laboratoire NutriTrax" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <AnimatedSection>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground mb-6">Notre Histoire</h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Depuis 2020, NutriTrax s'engage à fournir aux sportifs marocains des compléments alimentaires de qualité pharmaceutique.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <img src={aboutTeam} alt="Équipe NutriTrax" className="rounded-2xl shadow-2xl w-full" />
            </AnimatedSection>
            <AnimatedSection direction="right">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">Notre Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Chez NutriTrax, nous croyons que chaque sportif mérite d'accéder à des compléments alimentaires de la plus haute qualité. 
                Basés à Casablanca, nous sélectionnons les meilleurs ingrédients du monde pour créer des formules efficaces, 
                testées en laboratoire et accessibles à tous les Marocains.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Notre équipe de nutritionnistes, chimistes et passionnés de sport travaille chaque jour pour repousser les limites 
                de la nutrition sportive. Chaque produit NutriTrax est le fruit de recherches approfondies et d'un engagement 
                sans compromis envers la qualité.
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-3xl font-bold text-primary">15K+</p>
                  <p className="text-sm text-muted-foreground">Clients satisfaits</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">25+</p>
                  <p className="text-sm text-muted-foreground">Produits premium</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">99%</p>
                  <p className="text-sm text-muted-foreground">Taux satisfaction</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28 bg-muted/50">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Nos Valeurs</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Les piliers qui guident chacune de nos décisions.</p>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <StaggerItem key={i}>
                <div className="text-center bg-card rounded-xl p-8 border border-border hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <v.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Notre Parcours</h2>
          </AnimatedSection>
          <div className="max-w-2xl mx-auto">
            <StaggerContainer className="space-y-0">
              {milestones.map((m, i) => (
                <StaggerItem key={i}>
                  <div className="flex gap-6 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-accent flex-shrink-0 mt-1.5" />
                      {i < milestones.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-accent mb-1">{m.year}</p>
                      <p className="text-foreground">{m.event}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default AboutPage;
