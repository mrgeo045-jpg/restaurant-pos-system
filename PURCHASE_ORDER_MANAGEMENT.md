# Purchase Order Management System - Complete Implementation

## Overview
Comprehensive Purchase Order (PO) Management system integrating suppliers, inventory, receipts, and cost tracking for restaurant operations.

## Phase 1: Database Schema

### Suppliers Table
```sql
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  payment_terms VARCHAR(100),
  lead_time_days INT DEFAULT 2,
  min_order_quantity DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_suppliers_restaurant_id ON suppliers(restaurant_id);
```

### Purchase Orders Table
```sql
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL,
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  po_number VARCHAR(50) UNIQUE NOT NULL,
  order_date TIMESTAMP DEFAULT NOW(),
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  status VARCHAR(50) DEFAULT 'draft', -- draft, pending, confirmed, received, cancelled
  subtotal DECIMAL(12, 2),
  tax DECIMAL(12, 2),
  shipping_cost DECIMAL(12, 2),
  total DECIMAL(12, 2),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_po_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
```

### Purchase Order Line Items
```sql
CREATE TABLE po_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id),
  supplier_sku VARCHAR(100),
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(10, 4) NOT NULL,
  line_total DECIMAL(12, 2),
  received_quantity DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_po_items_po_id ON po_line_items(po_id);
```

### Receipt Records Table
```sql
CREATE TABLE purchase_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID NOT NULL REFERENCES purchase_orders(id),
  receipt_number VARCHAR(50) UNIQUE NOT NULL,
  receipt_date TIMESTAMP DEFAULT NOW(),
  supplier_invoice_number VARCHAR(100),
  received_by UUID NOT NULL REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_receipt_po_id ON purchase_receipts(po_id);
```

### Receipt Line Items with Auto Inventory Update
```sql
CREATE TABLE receipt_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id UUID NOT NULL REFERENCES purchase_receipts(id) ON DELETE CASCADE,
  po_line_item_id UUID NOT NULL REFERENCES po_line_items(id),
  quantity_received DECIMAL(10, 2) NOT NULL,
  quantity_rejected DECIMAL(10, 2) DEFAULT 0,
  unit_cost DECIMAL(10, 4),
  received_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_receipt_items_receipt_id ON receipt_line_items(receipt_id);
```

### Supplier Performance Metrics Table
```sql
CREATE TABLE supplier_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES suppliers(id),
  month DATE,
  total_orders INT,
  on_time_deliveries INT,
  complete_orders INT,
  avg_lead_time_days DECIMAL(5, 2),
  total_spent DECIMAL(12, 2),
  quality_score DECIMAL(3, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_metrics_supplier_id ON supplier_metrics(supplier_id);
```

## Phase 2: API Endpoints

### Suppliers API
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers` - List suppliers
- `GET /api/suppliers/:id` - Get supplier details
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Purchase Orders API
- `POST /api/purchase-orders` - Create new PO
- `GET /api/purchase-orders` - List all POs with filters
- `GET /api/purchase-orders/:id` - Get PO details
- `PUT /api/purchase-orders/:id` - Update PO
- `DELETE /api/purchase-orders/:id` - Cancel PO
- `POST /api/purchase-orders/:id/submit` - Submit for approval
- `POST /api/purchase-orders/:id/confirm` - Confirm order

### Receipts API
- `POST /api/receipts` - Record receipt
- `GET /api/receipts` - List receipts
- `GET /api/receipts/:id` - Get receipt details
- `POST /api/receipts/:id/accept` - Accept receipt (triggers inventory update)

### Analytics API
- `GET /api/analytics/supplier-performance` - Supplier metrics
- `GET /api/analytics/cost-trends` - Cost analysis by supplier/category
- `GET /api/analytics/delivery-performance` - On-time delivery rates

## Phase 3: Automatic Inventory Integration

When a receipt is accepted:
1. Update inventory stock quantity
2. Record cost per unit from receipt
3. Update last supplier for item
4. Recalculate reorder points
5. Create inventory movement log
6. Trigger low-stock alerts if needed

## Phase 4: UI Components

### Supplier Management Page
- Supplier list with search/filter
- Add/edit supplier form
- Contact information management
- Performance tracking

### Purchase Order Dashboard
- Create new PO interface
- Item selection from inventory
- Dynamic pricing from suppliers
- Order status tracking
- Delivery date management

### Receipt Recording
- Quick receipt entry form
- Comparison with original PO
- Quantity discrepancy handling
- Quality/damage notes
- Automatic inventory sync

### Analytics Dashboard
- Supplier performance metrics
- Cost trends visualization
- Delivery performance charts
- Budget vs actual spending

## Key Features

1. **Supplier Management**
   - Multiple suppliers per item
   - Lead time tracking
   - Payment terms
   - Contact management

2. **Purchase Order Creation**
   - Draft/Save functionality
   - Real-time pricing
   - Quantity constraints
   - Delivery date estimation

3. **Receipt Processing**
   - Automatic quantity discrepancy detection
   - Quality control notes
   - Damage/return tracking
   - Instant inventory updates

4. **Cost Tracking**
   - Per-unit cost history
   - Supplier cost comparison
   - Budget tracking
   - Invoice reconciliation

5. **Performance Analytics**
   - On-time delivery rates
   - Order fulfillment rate
   - Cost trends
   - Quality metrics

## Implementation Timeline

- **Week 1-2**: Database schema setup + Supplier APIs
- **Week 2-3**: Purchase Order APIs + UI
- **Week 3-4**: Receipt system + Inventory integration
- **Week 4-5**: Analytics + Performance tracking
- **Week 5-6**: Testing + Optimization

## Status: Foundation Ready for Development

✅ Schema designed
✅ API endpoints documented
✅ Integration points identified
⏳ Implementation ready to begin
