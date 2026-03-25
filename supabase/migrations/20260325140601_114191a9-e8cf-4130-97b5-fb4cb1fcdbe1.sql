
-- 1. Site settings table (contact info, social media, shipping)
CREATE TABLE public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  facebook TEXT,
  instagram TEXT,
  tiktok TEXT,
  youtube TEXT,
  shipping_price NUMERIC DEFAULT 50,
  free_shipping_threshold NUMERIC DEFAULT 500,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone"
  ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Admins can manage settings"
  ON public.site_settings FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.site_settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

-- 2. Promos / carousel table
CREATE TABLE public.promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  badge TEXT,
  image TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Promos are viewable by everyone"
  ON public.promos FOR SELECT USING (true);

CREATE POLICY "Admins can manage promos"
  ON public.promos FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Add shipping_price column to products (per-product override)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS shipping_price NUMERIC DEFAULT NULL;
