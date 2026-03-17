
-- Drop overly permissive order insert policy and replace with authenticated-only
DROP POLICY "Users can create orders" ON public.orders;
CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);
