# Supabase Setup Guide for Restaurant POS System

## Overview
This guide provides instructions for setting up the Supabase database for the Restaurant POS System.

## Required Environment Variables

Add these to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Tables SQL

Run these SQL commands in your Supabase SQL editor:

### 1. Menu Items Table
```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Tables Table
```sql
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number_ar TEXT NOT NULL,
  number_en TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  status TEXT DEFAULT 'empty' CHECK (status IN ('empty', 'occupied', 'pending_payment')),
  number_of_guests INTEGER,
  current_order_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  subtotal NUMERIC(10, 2) DEFAULT 0,
  tax_rate NUMERIC(4, 2) DEFAULT 0.15,
  tax_amount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);
```

### 4. Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES menu_items(id),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Bill Split Person Table
```sql
CREATE TABLE bill_split_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  person_name TEXT NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  tax_amount NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6. Bill Split Items Table
```sql
CREATE TABLE bill_split_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_split_person_id UUID NOT NULL REFERENCES bill_split_persons(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES order_items(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Index Creation for Performance

```sql
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_item_id ON order_items(item_id);
CREATE INDEX idx_bill_split_persons_order_id ON bill_split_persons(order_id);
CREATE INDEX idx_bill_split_items_person_id ON bill_split_items(bill_split_person_id);
```

## Next Steps

1. Run the SQL commands above in Supabase
2. Set your environment variables
3. Use the database service functions in `lib/models/orders.ts`
4. Create API routes using the Supabase services
