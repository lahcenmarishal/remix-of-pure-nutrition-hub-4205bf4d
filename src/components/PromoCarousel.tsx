import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import AnimatedSection from "@/components/AnimatedSection";

const PromoCarousel = () => {
  const { data: products = [], isLoading } = useProducts();
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);

  const promoProducts = products.filter(
    (product) =>
      Boolean(product.promoLabel) ||
      (typeof product.originalPrice === "number" && product.originalPrice > product.price)
  );

  const carouselProducts = (promoProducts.length > 0 ? promoProducts : products).slice(0, 8);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || carouselProducts.length === 0) return;

    const speed = 0.5;
    const animate = () => {
      posRef.current += speed;
      const half = track.scrollWidth / 2;
      if (posRef.current >= half) posRef.current = 0;
      track.style.transform = `translateX(-${posRef.current}px)`;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [carouselProducts.length]);

  if (isLoading || carouselProducts.length === 0) return null;

  const slides = [...carouselProducts, ...carouselProducts];

  return (
    <AnimatedSection className="py-12 overflow-hidden bg-muted/30 border-y border-border">
      <div className="text-center mb-8 px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">⚡ Offres exclusives</span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2">Promotions en cours</h2>
      </div>
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-5 w-max will-change-transform">
          {slides.map((product, idx) => (
            <Link
              key={`${product.id}-${idx}`}
              to={`/produit/${product.slug}`}
              className="relative flex-shrink-0 w-[24rem] md:w-[28rem] h-56 md:h-64 rounded-2xl overflow-hidden border border-border bg-card group cursor-pointer"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              {(product.promoLabel || product.badge) && (
                <div className="absolute top-3 left-3">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
                    {product.promoLabel || (product.badge === "new" ? "Nouveau" : "Best Seller")}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-lg font-bold text-foreground leading-tight">{product.name}</p>
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{product.price.toFixed(2)} DH</p>
                  {typeof product.originalPrice === "number" && product.originalPrice > product.price && (
                    <>
                      <p className="text-xs text-muted-foreground line-through">{product.originalPrice.toFixed(2)} DH</p>
                      <p className="text-xs font-semibold text-accent">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </p>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PromoCarousel;
