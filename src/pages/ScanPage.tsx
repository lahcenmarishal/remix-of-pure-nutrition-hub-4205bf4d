import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, XCircle, ShoppingBag } from "lucide-react";

const ScanPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") || "";

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["scan-product", code],
    enabled: !!code,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("barcode", code)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-xl">
          {!code ? (
            <div className="text-center py-20">
              <XCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">Aucun code fourni</h1>
              <p className="text-muted-foreground">Ajoutez <code className="bg-muted px-2 py-1 rounded text-sm">?code=XXXX</code> à l'URL.</p>
            </div>
          ) : isLoading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Recherche du produit...</p>
            </div>
          ) : product ? (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-semibold">Ce produit est disponible sur notre site</span>
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground">{product.name}</h1>
                <p className="text-muted-foreground text-sm">{product.short_description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary">{Number(product.price).toFixed(2)} DH</span>
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through">{Number(product.original_price).toFixed(2)} DH</span>
                  )}
                </div>
                <Link to={`/produit/${product.slug}`}
                  className="inline-flex items-center gap-2 w-full justify-center px-6 py-3.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm uppercase tracking-wider">
                  <ShoppingBag className="w-4 h-4" /> Voir le produit
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">Produit non trouvé</h1>
              <p className="text-muted-foreground mb-6">Aucun produit ne correspond au code <strong>{code}</strong>.</p>
              <Link to="/boutique" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm">
                Parcourir la boutique
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScanPage;
