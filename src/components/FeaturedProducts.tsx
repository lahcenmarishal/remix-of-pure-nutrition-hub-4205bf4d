import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/lib/products";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const ProductCard = ({ product }: { product: Product }) => (
  <Link
    to={`/produit/${product.slug}`}
    className="group block bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300"
  >
    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
      <img src={product.image} alt={product.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${product.isInStock === false ? "opacity-50" : ""}`} loading="lazy" />
      {product.isInStock === false && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-destructive text-destructive-foreground text-xs font-bold uppercase px-3 py-1.5 rounded-full">Rupture de stock</span>
        </div>
      )}
      {product.isInStock !== false && (product.badge || product.promoLabel) && (
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badge && (
            <span className={product.badge === "new" ? "badge-new" : "badge-bestseller"}>
              {product.badge === "new" ? "Nouveau" : "Best Seller"}
            </span>
          )}
          {product.promoLabel && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
              {product.promoLabel}
            </span>
          )}
        </div>
      )}
    </div>
    <div className="p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.category.replace("-", " ")}</p>
      <h3 className="font-display text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-foreground">{product.price.toFixed(2)} DH</span>
        {product.originalPrice && (
          <span className="text-sm text-muted-foreground line-through">{product.originalPrice.toFixed(2)} DH</span>
        )}
      </div>
    </div>
  </Link>
);

const FeaturedProducts = () => {
  const { data: products = [] } = useProducts();
  const featured = products.filter((p) => p.badge).slice(0, 4);

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4">
        <AnimatedSection className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Nos produits phares</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Sélectionnés pour leur efficacité et plébiscités par nos clients.</p>
        </AnimatedSection>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard product={p} />
            </StaggerItem>
          ))}
        </StaggerContainer>
        <AnimatedSection className="text-center mt-12" delay={0.3}>
          <Link to="/boutique" className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-all text-sm uppercase tracking-wider">
            Voir tous les produits
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
};

export { ProductCard };
export default FeaturedProducts;
