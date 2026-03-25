import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { usePromos } from "@/hooks/usePromos";
import AnimatedSection from "@/components/AnimatedSection";

const PromoCarousel = () => {
  const { data: promos = [], isLoading } = usePromos();
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || promos.length === 0) return;

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
  }, [promos.length]);

  if (isLoading || promos.length === 0) return null;

  const slides = [...promos, ...promos];

  return (
    <AnimatedSection className="py-12 overflow-hidden bg-muted/30 border-y border-border">
      <div className="text-center mb-8 px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">⚡ Offres exclusives</span>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-2">Promotions en cours</h2>
      </div>
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-5 w-max will-change-transform">
          {slides.map((promo, idx) => (
            <Link
              key={`${promo.id}-${idx}`}
              to={promo.link || "/shop"}
              className="relative flex-shrink-0 w-80 h-48 rounded-2xl overflow-hidden border border-border bg-card group cursor-pointer"
            >
              {promo.image && (
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              {promo.badge && (
                <div className="absolute top-3 left-3">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
                    {promo.badge}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-base font-bold text-foreground leading-tight">{promo.title}</p>
                {promo.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{promo.subtitle}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PromoCarousel;
