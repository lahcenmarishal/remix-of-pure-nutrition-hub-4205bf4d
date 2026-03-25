import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

    const speed = 0.5; // px per frame
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
  }, [promos]);

  if (isLoading || promos.length === 0) return null;

  // Duplicate for seamless loop
  const slides = [...promos, ...promos];

  return (
    <AnimatedSection className="py-10 overflow-hidden bg-muted/30 border-y border-border">
      <div className="text-center mb-6 px-4">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">⚡ Offres exclusives</span>
      </div>
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-4 w-max will-change-transform">
          {slides.map((promo, idx) => {
            const card = (
              <div
                className="relative flex-shrink-0 w-72 h-36 rounded-2xl overflow-hidden border border-border bg-card group cursor-pointer"
                style={{
                  background: promo.image
                    ? undefined
                    : "linear-gradient(135deg, hsl(var(--primary)/0.15), hsl(var(--accent)/0.15))",
                }}
              >
                {promo.image && (
                  <img src={promo.image} alt={promo.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  {promo.badge && (
                    <span className="inline-block mb-1 text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                      {promo.badge}
                    </span>
                  )}
                  <p className="text-sm font-bold text-foreground leading-tight">{promo.title}</p>
                  {promo.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{promo.subtitle}</p>}
                </div>
              </div>
            );

            return promo.link ? (
              <Link key={`${promo.id}-${idx}`} to={promo.link}>
                {card}
              </Link>
            ) : (
              <div key={`${promo.id}-${idx}`}>{card}</div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PromoCarousel;
