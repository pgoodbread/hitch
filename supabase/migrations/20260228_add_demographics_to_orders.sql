-- Add optional demographics columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS looking_for text[];
