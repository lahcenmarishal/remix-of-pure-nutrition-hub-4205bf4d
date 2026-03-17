import { useParams, Link } from "react-router-dom";
import { Star, ShoppingCart, ChevronRight, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/FeaturedProducts";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductPage = () => {
  const { slug } = useParams();
  const { data: products = [], isLoading } = useProducts();
  const product = products.find((p) => p.slug === slug);
  const [qty, setQty] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center"><p className="text-muted-foreground">Chargement...</p></div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-display font-bold text-foreground">Produit non trouvé</h1>
          <Link to="/boutique" className="text-primary mt-4 inline-block hover:underline">Retour à la boutique</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/boutique" className="hover:text-foreground transition-colors">Boutique</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>

            <div className="flex flex-col justify-center">
              {product.badge && (
                <span className={`self-start mb-4 ${product.badge === "new" ? "badge-new" : "badge-bestseller"}`}>
                  {product.badge === "new" ? "Nouveau" : "Best Seller"}
                </span>
              )}
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} avis)</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-foreground">{product.price.toFixed(2)} DH</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">{product.originalPrice.toFixed(2)} DH</span>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

              <div className="mb-8">
                <h3 className="font-display font-semibold text-foreground mb-3">Bénéfices</h3>
                <ul className="space-y-2">
                  {product.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-muted transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="w-12 text-center font-medium">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-muted transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <button
                  onClick={() => { addToCart(product, qty); setQty(1); }}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
                >
                  <ShoppingCart className="w-4 h-4" /> Ajouter au panier
                </button>
              </div>

              {product.ingredients.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-display font-semibold text-foreground mb-3">Informations nutritionnelles</h3>
                  <div className="border border-border rounded-lg overflow-hidden">
                    {product.ingredients.map((ing, i) => (
                      <div key={i} className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-muted/50" : ""}`}>
                        <span className="text-foreground">{ing.name}</span>
                        <span className="font-medium text-foreground">{ing.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {product.faq.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-3">Questions fréquentes</h3>
                  <div className="space-y-2">
                    {product.faq.map((f, i) => (
                      <div key={i} className="border border-border rounded-lg">
                        <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                          className="w-full flex justify-between items-center p-4 text-sm font-medium text-foreground text-left">
                          {f.question}
                          <Plus className={`w-4 h-4 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-45" : ""}`} />
                        </button>
                        {openFaq === i && <div className="px-4 pb-4 text-sm text-muted-foreground">{f.answer}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-8">Produits complémentaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
