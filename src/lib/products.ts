export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  shippingPrice?: number | null;
  image: string;
  category: string;
  badge?: "new" | "bestseller";
  promoLabel?: string | null;
  rating: number;
  reviews: number;
  shortDescription: string;
  description: string;
  benefits: string[];
  ingredients: { name: string; amount: string }[];
  faq: { question: string; answer: string }[];
  barcode?: string | null;
  sortOrder?: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Whey Protein Isolate",
    slug: "whey-protein-isolate",
    price: 49.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80",
    category: "prise-de-masse",
    badge: "bestseller",
    rating: 4.8,
    reviews: 342,
    shortDescription: "Protéine de lactosérum isolée de qualité premium, 90% de pureté.",
    description: "Notre Whey Protein Isolate est obtenue par microfiltration à froid pour préserver la qualité des acides aminés. Avec 27g de protéines par dose et moins de 1g de sucre, c'est le choix idéal pour la récupération musculaire.",
    benefits: [
      "27g de protéines par dose",
      "Moins de 1g de sucre",
      "Microfiltration à froid",
      "Absorption rapide",
      "Sans gluten",
    ],
    ingredients: [
      { name: "Protéines", amount: "27g" },
      { name: "BCAA", amount: "6.5g" },
      { name: "Leucine", amount: "3g" },
      { name: "Glucides", amount: "2g" },
      { name: "Lipides", amount: "0.5g" },
    ],
    faq: [
      { question: "Quand prendre ce produit ?", answer: "Idéalement dans les 30 minutes après l'entraînement pour une récupération optimale." },
      { question: "Convient-il aux intolérants au lactose ?", answer: "Notre isolat contient moins de 1% de lactose, ce qui le rend tolérable pour la plupart des personnes sensibles." },
    ],
  },
  {
    id: "2",
    name: "Omega-3 Premium",
    slug: "omega-3-premium",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
    category: "immunite",
    badge: "new",
    rating: 4.9,
    reviews: 189,
    shortDescription: "Huile de poisson ultra-concentrée, certifiée IFOS 5 étoiles.",
    description: "Nos Omega-3 Premium sont issus de poissons sauvages pêchés durablement. Chaque capsule contient 1000mg d'EPA/DHA pour soutenir la santé cardiovasculaire et cognitive.",
    benefits: ["1000mg EPA/DHA par dose", "Certifié IFOS 5 étoiles", "Pêche durable", "Sans métaux lourds", "Capsules entérosolubles"],
    ingredients: [
      { name: "EPA", amount: "600mg" },
      { name: "DHA", amount: "400mg" },
      { name: "Vitamine E", amount: "10mg" },
    ],
    faq: [
      { question: "Combien de capsules par jour ?", answer: "2 capsules par jour avec un repas." },
    ],
  },
  {
    id: "3",
    name: "Complexe Multivitamines",
    slug: "complexe-multivitamines",
    price: 34.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
    category: "immunite",
    rating: 4.7,
    reviews: 256,
    shortDescription: "25 vitamines et minéraux essentiels pour votre santé quotidienne.",
    description: "Notre Complexe Multivitamines couvre 100% des apports journaliers recommandés en 25 vitamines et minéraux essentiels. Formulé pour les sportifs et les personnes actives.",
    benefits: ["25 vitamines et minéraux", "100% AJR", "1 comprimé/jour", "Formule sport", "Biodisponibilité optimisée"],
    ingredients: [
      { name: "Vitamine C", amount: "80mg" },
      { name: "Vitamine D3", amount: "25µg" },
      { name: "Zinc", amount: "10mg" },
      { name: "Fer", amount: "14mg" },
      { name: "Magnésium", amount: "375mg" },
    ],
    faq: [],
  },
  {
    id: "4",
    name: "Créatine Monohydrate",
    slug: "creatine-monohydrate",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&q=80",
    category: "prise-de-masse",
    badge: "bestseller",
    rating: 4.9,
    reviews: 512,
    shortDescription: "Créatine monohydrate pure à 99.9%, certifiée Creapure®.",
    description: "La référence en matière de créatine. Notre Créatine Monohydrate Creapure® est la plus pure du marché, idéale pour augmenter la force et la performance.",
    benefits: ["Pureté 99.9%", "Certifiée Creapure®", "5g par dose", "Sans additifs", "Vegan"],
    ingredients: [{ name: "Créatine monohydrate", amount: "5g" }],
    faq: [
      { question: "Faut-il faire une phase de charge ?", answer: "Non, 5g par jour suffisent pour des résultats optimaux." },
    ],
  },
  {
    id: "5",
    name: "Pre-Workout Ignite",
    slug: "pre-workout-ignite",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80",
    category: "energie",
    badge: "new",
    rating: 4.6,
    reviews: 98,
    shortDescription: "Formule pré-entraînement pour une énergie et un focus maximum.",
    description: "Ignite est notre formule pré-entraînement conçue pour maximiser votre énergie, votre concentration et votre endurance pendant l'entraînement.",
    benefits: ["200mg de caféine naturelle", "Beta-alanine", "Citrulline malate", "Sans sucre", "Saveur fruit de la passion"],
    ingredients: [
      { name: "Caféine", amount: "200mg" },
      { name: "Beta-alanine", amount: "3.2g" },
      { name: "Citrulline malate", amount: "6g" },
      { name: "L-Tyrosine", amount: "1g" },
    ],
    faq: [],
  },
  {
    id: "6",
    name: "BCAA 2:1:1",
    slug: "bcaa-211",
    price: 27.99,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    category: "prise-de-masse",
    rating: 4.5,
    reviews: 178,
    shortDescription: "Acides aminés branchés ratio optimal 2:1:1 pour la récupération.",
    description: "Nos BCAA au ratio 2:1:1 favorisent la récupération musculaire et réduisent les courbatures. Idéal pendant ou après l'entraînement.",
    benefits: ["Ratio optimal 2:1:1", "Récupération accélérée", "Anti-catabolique", "Saveur naturelle", "Instantanéisé"],
    ingredients: [
      { name: "L-Leucine", amount: "3g" },
      { name: "L-Isoleucine", amount: "1.5g" },
      { name: "L-Valine", amount: "1.5g" },
    ],
    faq: [],
  },
];

export const categories = [
  { id: "all", label: "Tous" },
  { id: "prise-de-masse", label: "Prise de masse" },
  { id: "energie", label: "Énergie" },
  { id: "immunite", label: "Immunité" },
];
