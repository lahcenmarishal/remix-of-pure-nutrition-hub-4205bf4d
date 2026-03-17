import { useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 lg:py-28 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <AnimatedSection>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Rejoignez la communauté NutriTrax
          </h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">
            Recevez nos offres exclusives, conseils nutrition et nouveautés en avant-première.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
            >
              S'inscrire
            </button>
          </form>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default Newsletter;
