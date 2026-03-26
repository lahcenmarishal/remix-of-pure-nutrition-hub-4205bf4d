ALTER TABLE public.products ADD COLUMN IF NOT EXISTS barcode text UNIQUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;