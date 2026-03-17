import { useState } from "react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductCard } from "@/components/FeaturedProducts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ShopPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const filtered = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">Notre Boutique</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Découvrez notre gamme complète de compléments alimentaires premium.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-20"><p className="text-muted-foreground">Chargement...</p></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;
