# Admin Dashboard Setup Guide

## Prerequisites

Before using the admin dashboard, you need to set up Supabase:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key

## Environment Setup

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Database Setup

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `supabase/migrations/20240101000000_init_schema.sql`
   - `supabase/migrations/20250114000000_admin_schema.sql`

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## First-Time Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the admin dashboard:**
   ```
   http://localhost:3000/admin
   ```

3. **Seed the database with sample data:**
   - Navigate to: Admin → Өгөгдөл нэмэх (Seed Data)
   - Click "Өгөгдөл нэмэх" button
   - This will populate your database with sample products and categories

## Admin Dashboard Features

### 1. Dashboard (Хянах самбар)
- View statistics: Total products, categories, and orders
- Quick links to main admin functions

### 2. Products (Бүтээгдэхүүн)
- **List View:** See all products with prices, stock, and discounts
- **Add New:** Create new products with full details
- **Edit:** Update existing product information
- **Delete:** Remove products from the database

### 3. Categories (Ангилал)
- **Create:** Add new product categories
- **Edit:** Update category names and slugs
- **Delete:** Remove categories
- **Active/Inactive:** Toggle category visibility

### 4. Orders (Захиалга)
- View all customer orders
- See order details, status, and amounts

### 5. Settings (Тохиргоо)
- **Website Name:** Change the site name (appears in header)
- **Site Description:** Update the site description

### 6. Seed Data (Өгөгдөл нэмэх)
- One-click data seeding from mock products
- Useful for testing and initial setup

## How the Website Works

### Dynamic Website Name
The website name in the header is fetched from the `site_settings` table. Change it in:
- Admin → Тохиргоо (Settings)

### Product Display
The main website (`/`) fetches products from Supabase and displays them automatically.

### Product Detail Pages
Product URLs are generated based on brand, name, and ID:
- Format: `/products/{brand-name-id}`
- Example: `/products/sasha-fabiani-women-heeled-knee-boots-1`

## Database Schema

### Main Tables

**products**
- Product information (name, price, stock, sizes, etc.)
- Supports both English and Mongolian names
- Includes discount and financing options

**categories**
- Product categories with multilingual support
- Display order and active status

**site_settings**
- Key-value store for website configuration
- Currently: site_name, site_description

**orders**
- Customer orders with status tracking

**order_items**
- Individual items within orders

## Admin Access Control

Currently, the admin dashboard is accessible without authentication for development purposes. In production, you should:

1. Enable Supabase Auth
2. Set up admin users with `role = 'admin'` in the profiles table
3. The schema already includes Row Level Security (RLS) policies

## Common Tasks

### Adding a New Product
1. Admin → Бүтээгдэхүүн → + Бүтээгдэхүүн нэмэх
2. Fill in all required fields
3. Set prices, stock, and sizes
4. Click "Нэмэх"

### Changing Website Name
1. Admin → Тохиргоо
2. Update "Вэбсайтын нэр"
3. Click "Хадгалах"
4. Refresh the main website to see changes

### Managing Categories
1. Admin → Ангилал
2. Use the form to add/edit categories
3. Categories appear in the table on the right

## Troubleshooting

### Database Connection Issues
- Verify your `.env.local` file has correct credentials
- Check Supabase project is active

### Products Not Appearing
1. Run the seed script: Admin → Өгөгдөл нэмэх
2. Check products exist: Admin → Бүтээгдэхүүн

### Changes Not Showing
- Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)
- Next.js caches pages; restart dev server if needed

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## Support

For issues or questions, check:
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs
