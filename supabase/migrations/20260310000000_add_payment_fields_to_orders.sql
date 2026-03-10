ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_method text,
ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS qpay_invoice_id text,
ADD COLUMN IF NOT EXISTS qpay_payment_id text,
ADD COLUMN IF NOT EXISTS payment_confirmed_at timestamptz;

