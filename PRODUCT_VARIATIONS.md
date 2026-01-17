# Product Variations Feature

## Overview

Added support for product variations beyond just sizes - now supports **colors** and **materials** as well.

## Problem

**Before**: Only size variations
- ❌ No color options
- ❌ No material options
- ❌ Limited product flexibility
- ❌ No variant-specific stock tracking
- ❌ No variant-specific pricing

**After**: Full variation support
- ✅ Color variations
- ✅ Material variations  
- ✅ Size variations
- ✅ Individual stock per variant
- ✅ Price adjustments per variant
- ✅ Variant-specific images

## Database Schema

### Migration: `20260117000002_product_variations.sql`

**Added to `products` table**:
```sql
colors TEXT[]           -- Array of available colors
materials TEXT[]        -- Array of available materials
default_color TEXT      -- Default selected color
default_material TEXT   -- Default selected material
```

**New `product_variants` table**:
```sql
id UUID PRIMARY KEY
product_id UUID         -- Reference to product
color TEXT              -- Variant color
material TEXT           -- Variant material
size INTEGER            -- Variant size
sku TEXT UNIQUE         -- Unique SKU per variant
stock INTEGER           -- Stock for this specific variant
price_adjustment NUMERIC -- Additional cost (e.g., +5000 for leather)
images TEXT[]           -- Variant-specific images
is_active BOOLEAN       -- Enable/disable variant
```

**Unique constraint**: `(product_id, color, material, size)`

## Database Functions

### 1. `get_variant_stock()`
Get stock for a specific variant combination:
```sql
SELECT get_variant_stock(
  'product-uuid',
  'Red',      -- color
  'Leather',  -- material
  40          -- size
);
-- Returns: 15 (stock available)
```

### 2. `get_product_total_stock()`
Get total stock across all variants:
```sql
SELECT get_product_total_stock('product-uuid');
-- Returns: 150 (sum of all variants)
```

## Components

### 1. VariantSelector Component

**Location**: `src/components/Products/VariantSelector.tsx`

**Props**:
```typescript
{
  colors?: string[];           // Available colors
  materials?: string[];        // Available materials
  sizes?: number[];            // Available sizes
  defaultColor?: string;       // Pre-selected color
  defaultMaterial?: string;    // Pre-selected material
  defaultSize?: number;        // Pre-selected size
  onVariantChange: (variant) => void;  // Callback
}
```

**Usage**:
```typescript
<VariantSelector
  colors={['Red', 'Blue', 'Black']}
  materials={['Leather', 'Suede', 'Canvas']}
  sizes={[38, 39, 40, 41, 42]}
  defaultColor="Red"
  onVariantChange={(variant) => {
    // variant = { color: 'Red', material: 'Leather', size: 40 }
    checkStock(variant);
  }}
/>
```

**Features**:
- Beautiful button-based selection
- Visual feedback (blue ring on selected)
- Shows selected variant summary
- Auto-hides if no variants available

## API Endpoints

### Get Variant Stock

**Endpoint**: `GET /api/products/[id]/variant-stock`

**Query Parameters**:
- `color` (optional): Selected color
- `material` (optional): Selected material
- `size` (optional): Selected size

**Example Request**:
```
GET /api/products/123/variant-stock?color=Red&material=Leather&size=40
```

**Response**:
```json
{
  "stock": 15,
  "available": true,
  "priceAdjustment": 5000,
  "hasVariants": true
}
```

**Without Variants** (legacy products):
```json
{
  "stock": 50,
  "available": true,
  "hasVariants": false
}
```

## Data Model

### Example Product with Variants

**Product**:
```json
{
  "id": "prod-123",
  "name_en": "Women's Boots",
  "price": 89000,
  "colors": ["Red", "Black", "Brown"],
  "materials": ["Leather", "Suede"],
  "sizes": [36, 37, 38, 39, 40],
  "default_color": "Red",
  "default_material": "Leather"
}
```

**Variants**:
```json
[
  {
    "id": "var-1",
    "product_id": "prod-123",
    "color": "Red",
    "material": "Leather",
    "size": 38,
    "sku": "BOOT-RED-LEATH-38",
    "stock": 15,
    "price_adjustment": 0
  },
  {
    "id": "var-2",
    "product_id": "prod-123",
    "color": "Black",
    "material": "Suede",
    "size": 40,
    "sku": "BOOT-BLK-SUED-40",
    "stock": 8,
    "price_adjustment": 3000
  }
]
```

## Use Cases

### Use Case 1: Different Colors
```
Product: Women's Handbag
Colors: ["Red", "Black", "Brown", "Beige"]
Price: ₮45,000 (same for all colors)
Stock: Individual per color
```

### Use Case 2: Different Materials
```
Product: Men's Jacket
Materials: ["Cotton", "Leather", "Wool"]
Price: Base ₮120,000
  - Cotton: +₮0
  - Leather: +₮50,000
  - Wool: +₮30,000
```

### Use Case 3: Color + Material + Size
```
Product: Women's Boots
Colors: ["Red", "Black"]
Materials: ["Leather", "Suede"]
Sizes: [36, 37, 38, 39, 40]

Total combinations: 2 × 2 × 5 = 20 variants
Each with individual stock tracking
```

## Backward Compatibility

### Products WITHOUT Variants
- Continue to work as before
- Use product-level stock
- Size-only selection still works
- No migration needed for existing products

### Products WITH Variants
- Stock tracked per variant
- Shows variant selector UI
- Price adjustments applied
- Variant-specific images (optional)

## Admin Management

### Adding Variants

**Step 1**: Set available options on product
```typescript
colors: ['Red', 'Blue', 'Black']
materials: ['Leather', 'Canvas']
sizes: [38, 39, 40]
```

**Step 2**: Create variant combinations
```sql
INSERT INTO product_variants (
  product_id, color, material, size, sku, stock
) VALUES
  ('prod-123', 'Red', 'Leather', 38, 'SKU-001', 10),
  ('prod-123', 'Red', 'Leather', 39, 'SKU-002', 15),
  ('prod-123', 'Blue', 'Canvas', 38, 'SKU-003', 8);
```

**Step 3**: Set defaults
```typescript
default_color: 'Red'
default_material: 'Leather'
```

## Stock Management

### Variant Stock Check
```typescript
// Check specific variant
const response = await fetch(
  `/api/products/${productId}/variant-stock?color=Red&material=Leather&size=40`
);
const { stock, available } = await response.json();

if (!available) {
  alert('Out of stock');
}
```

### Total Stock Query
```sql
-- Get total stock across all variants
SELECT get_product_total_stock('prod-123');
```

### Update Variant Stock
```sql
UPDATE product_variants 
SET stock = stock - 1 
WHERE product_id = 'prod-123'
  AND color = 'Red'
  AND material = 'Leather'
  AND size = 40;
```

## UI/UX

### Variant Selector Design

**Color Selection**:
```
Color - Red
┌──────┐ ┌──────┐ ┌──────┐
│ Red  │ │ Blue │ │Black │
└──────┘ └──────┘ └──────┘
  ✓ (selected with blue ring)
```

**Material Selection**:
```
Material - Leather
┌─────────┐ ┌─────────┐ ┌─────────┐
│Leather  │ │ Suede   │ │ Canvas  │
└─────────┘ └─────────┘ └─────────┘
  ✓ (selected)
```

**Size Selection**:
```
Size - 40
┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│ 36 │ │ 37 │ │ 38 │ │ 39 │ │ 40 │
└────┘ └────┘ └────┘ └────┘ └────┘
                                ✓
```

**Selected Summary**:
```
──────────────────────────────────
Selected: Red / Leather / 40
```

## Benefits

### For Customers
- ✅ More product options
- ✅ Clear variant selection
- ✅ Real-time stock checking
- ✅ Better shopping experience

### For Store Owners
- ✅ Manage complex products
- ✅ Track stock per variant
- ✅ Price variations support
- ✅ Variant-specific images
- ✅ Better inventory management

### For Developers
- ✅ Flexible data model
- ✅ Backward compatible
- ✅ Type-safe interfaces
- ✅ Reusable components

## Future Enhancements

### Phase 1 (Current) ✅:
- Database schema
- Variant selector component
- Stock API
- Basic admin support

### Phase 2 (Planned):
- Admin UI for variant management
- Bulk variant creation
- Variant image upload
- Import/export variants

### Phase 3 (Advanced):
- Variant-based recommendations
- Low stock alerts per variant
- Variant analytics
- Dynamic pricing rules

## Migration Guide

### Step 1: Run Migration
```bash
# Run migration in Supabase SQL Editor
supabase/migrations/20260117000002_product_variations.sql
```

### Step 2: Update Product Types
```typescript
// Already updated in src/types/index.ts
interface Product {
  colors?: string[];
  materials?: string[];
  default_color?: string;
  default_material?: string;
}

interface ProductVariant {
  // New interface
}
```

### Step 3: Add Variant Selector
```typescript
import VariantSelector from '@/components/Products/VariantSelector';

<VariantSelector
  colors={product.colors}
  materials={product.materials}
  sizes={product.sizes}
  onVariantChange={handleVariantChange}
/>
```

## Summary

✅ **Database Schema**: Added `colors`, `materials` to products + new `product_variants` table
✅ **Components**: `VariantSelector` component (< 160 lines)
✅ **API**: `/api/products/[id]/variant-stock` endpoint
✅ **Types**: Updated Product interface with variant support
✅ **Functions**: `get_variant_stock()` and `get_product_total_stock()`
✅ **Backward Compatible**: Existing products still work
✅ **Flexible**: Supports any combination of color/material/size
✅ **Stock Tracking**: Individual stock per variant

Your e-commerce platform now supports full product variations! 🎨📦
