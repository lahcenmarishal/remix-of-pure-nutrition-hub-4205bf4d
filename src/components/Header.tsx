import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu, X, Settings, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/lib/products";
import logo from "@/assets/nutritrax-logo.png";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { totalItems, openDrawer } = useCart();
  const { isAdmin } = useAuth();
  const { data: products = [] } = useProducts();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  // Close search on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const headerBg = scrolled || !isHome
    ? "bg-background/95 backdrop-blur-md shadow-sm"
    : "bg-transparent";

  const textColor = scrolled || !isHome ? "text-foreground" : "text-primary-foreground";

  const navLinks = [
    { to: "/", label: "Accueil" },
    { to: "/boutique", label: "Boutique" },
    { to: "/a-propos", label: "À propos" },
    { to: "/temoignages", label: "Témoignages" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const results: Product[] = query.trim().length >= 2
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSelect = (slug: string) => {
    navigate(`/produit/${slug}`);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="NutriTrax Nutrition" className="h-24 w-auto drop-shadow-lg" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-accent ${textColor} ${
                  location.pathname === link.to ? "text-accent" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 transition-colors hover:text-accent ${textColor}`}
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-background/98 backdrop-blur-md border border-border rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder="Rechercher un produit..."
                      className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      onKeyDown={e => {
                        if (e.key === "Enter" && results.length > 0) handleSelect(results[0].slug);
                        if (e.key === "Escape") { setSearchOpen(false); setQuery(""); }
                      }}
                    />
                    {query && (
                      <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {results.length > 0 ? (
                    <ul className="py-1 max-h-72 overflow-y-auto">
                      {results.map(p => (
                        <li key={p.id}>
                          <button
                            onClick={() => handleSelect(p.slug)}
                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted text-left"
                          >
                            <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.price.toFixed(2)} DH</p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : query.trim().length >= 2 ? (
                    <p className="text-center text-xs text-muted-foreground py-4">Aucun résultat pour « {query} »</p>
                  ) : (
                    <p className="text-center text-xs text-muted-foreground py-4">Saisir au moins 2 caractères…</p>
                  )}
                  {results.length > 0 && (
                    <div className="border-t border-border px-3 py-2">
                      <button
                        onClick={() => { navigate(`/boutique?q=${encodeURIComponent(query)}`); setSearchOpen(false); setQuery(""); }}
                        className="text-xs text-primary hover:underline"
                      >
                        Voir tous les résultats →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isAdmin && (
              <Link to="/admin" className={`p-2 transition-colors hover:text-accent ${textColor}`}>
                <Settings className="w-5 h-5" />
              </Link>
            )}
            <Link to="/admin" className={`p-2 transition-colors hover:text-accent ${textColor}`}>
              <User className="w-5 h-5" />
            </Link>
            <button onClick={openDrawer} className={`p-2 relative transition-colors hover:text-accent ${textColor}`}>
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              className={`lg:hidden p-2 ${textColor}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border animate-fade-in">
          {/* Mobile search */}
          <div className="container mx-auto px-4 pt-4">
            <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-muted/30">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher..."
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    navigate(`/boutique?q=${encodeURIComponent(query)}`);
                    setMobileOpen(false); setQuery("");
                  }
                }}
              />
            </div>
          </div>
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-foreground hover:text-accent transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
