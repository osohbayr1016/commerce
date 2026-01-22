# 🚀 Spin Wheel - Quick Start Guide

## ⚡ 5 минутанд эхлүүлэх

### 1️⃣ Database Migration (30 секунд)

```bash
cd my-ecommerce
supabase db push
```

Эсвэл Supabase Dashboard → SQL Editor → Paste & Run:
```sql
-- File: supabase/migrations/20260122100000_spin_wheel_system.sql
```

### 2️⃣ Verify Installation (30 секунд)

```bash
npm run build
```

✅ Should see: `✓ Compiled successfully`

### 3️⃣ Start Server (10 секунд)

```bash
npm run dev
```

### 4️⃣ Add Products (2 минут)

1. Navigate: `http://localhost:3000/admin`
2. Click: **"🎰 Spin Wheel"**
3. Click: **"+ Бүтээгдэхүүн нэмэх"**
4. Select 5-10 products
5. Click "Нэмэх" for each

### 5️⃣ Test Spin (1 минут)

1. Navigate: `http://localhost:3000/profile?tab=spin`
2. Ensure you have 100+ coins
3. Click: **"🎰 SPIN ЭРГҮҮЛЭХ"**
4. Watch animation (4 seconds)
5. See result modal! 🎉

---

## 🎯 Key URLs

| Page | URL | Access |
|------|-----|--------|
| User Spin | `/profile?tab=spin` | All users |
| Admin Management | `/admin/spin` | Admin only |
| Admin Dashboard | `/admin` | Admin only |
| Profile | `/profile` | All users |

---

## 🔑 Key Commands

```bash
# Database
supabase db push                    # Apply migration
supabase db reset                   # Reset database
psql [connection] -c "SELECT * FROM spin_products;"

# Development
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run start                       # Start production server

# Testing
curl http://localhost:3000/api/spin/eligibility  # Check eligibility
curl -X POST http://localhost:3000/api/spin/play # Spin (need auth)
```

---

## 📋 Quick Checks

### ✅ Is it working?

**Check 1: Database**
```sql
SELECT COUNT(*) FROM spin_products WHERE is_active = true;
-- Should return: number of active products
```

**Check 2: API**
```bash
curl http://localhost:3000/api/spin/eligibility
# Should return JSON with eligibility info
```

**Check 3: UI**
- Visit `/profile?tab=spin`
- Should see spin wheel
- Button should be enabled (if you have 100+ coins)

---

## 🆘 Troubleshooting

### Problem: Button disabled
**Solution:** Check coin balance (need 100+)

### Problem: No products in wheel
**Solution:** Add products in `/admin/spin`

### Problem: "Already spun today"
**Solution:** Wait until tomorrow (resets at midnight UTC+8)

### Problem: Build error
**Solution:** 
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 📊 Quick Stats

After adding products and testing:

```bash
# Check total spins
SELECT COUNT(*) FROM spin_history;

# Check user's last spin
SELECT * FROM spin_history 
WHERE user_id = '[your-user-id]' 
ORDER BY won_at DESC LIMIT 1;

# Check most won products
SELECT product_id, COUNT(*) as wins 
FROM spin_history 
GROUP BY product_id 
ORDER BY wins DESC;
```

---

## 🎉 Done!

You now have a fully functional Lucky Spin Wheel!

**Next steps:**
1. ✅ Add more products
2. ✅ Test with real users
3. ✅ Monitor statistics
4. ✅ Enjoy! 🎰

---

**Need help?** Check `SPIN_WHEEL_SYSTEM.md` for full documentation.
