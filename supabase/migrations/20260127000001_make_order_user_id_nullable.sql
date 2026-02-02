-- Make user_id nullable to support guest checkout
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Allow public access to create orders (guest checkout)
CREATE POLICY "Orders: create public" ON public.orders FOR INSERT TO public WITH CHECK (true);

-- Allow guests to read their own orders immediately after creation? 
-- Usually this is handled by returning the order details in the response.
-- But for "Orders: read own", it uses auth.uid(). Guests have no uid.
-- So they can't list their orders. This is expected for guest checkout.
