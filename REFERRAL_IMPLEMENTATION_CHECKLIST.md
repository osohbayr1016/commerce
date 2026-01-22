# Referral System Implementation Checklist

## ✅ Completed Items

### Database & Backend
- [x] Database migration created (`20260122000001_referral_system.sql`)
- [x] Added `is_top6`, `promo_code`, `accumulated_discount_percent`, `total_referrals` to profiles
- [x] Created `referrals` table with RLS policies
- [x] Created `discount_events` table with RLS policies
- [x] Created `get_user_purchases_last_30_days()` function
- [x] Created `award_referral_discount()` function
- [x] Created `is_promo_code_available()` function
- [x] Created `get_referral_stats()` function
- [x] Updated `orders` API to trigger referral rewards

### API Routes
- [x] `POST /api/referral/create-code` - Create/update promo code
- [x] `GET /api/referral/create-code` - Get current promo code
- [x] `POST /api/referral/validate` - Validate promo code on signup
- [x] `GET /api/referral/stats` - Get user's referral stats
- [x] `GET /api/admin/top6` - List Top 6 members
- [x] `POST /api/admin/top6` - Add to Top 6
- [x] `DELETE /api/admin/top6` - Remove from Top 6
- [x] `GET /api/admin/referral-network` - View referral network
- [x] `GET /api/admin/referral-analytics` - View analytics
- [x] `GET /api/admin/users/search` - Search users for Top 6

### Frontend Components
- [x] `PromoCodeManager` - Create/edit promo code
- [x] `ReferralStats` - View referral stats and discount history
- [x] `DiscountSelector` - Use discount at checkout
- [x] `Top6Manager` - Admin Top 6 management
- [x] `ReferralAnalytics` - Admin analytics dashboard

### Integration
- [x] Added promo code input to signup page
- [x] Promo code validation on signup
- [x] Added "🎁 Promo Code" tab to profile page
- [x] Integrated DiscountSelector in checkout
- [x] Added Top 6 & Analytics links to admin dashboard
- [x] Created admin pages for Top 6 and Analytics

### TypeScript Types
- [x] Updated `Profile` interface
- [x] Added `Referral` interface
- [x] Added `DiscountEvent` interface
- [x] Added `ReferralStats` interface
- [x] Added `Top6Member` interface
- [x] Added `ReferralNetworkNode` interface

### Documentation
- [x] Created `REFERRAL_SYSTEM_SUMMARY.md`
- [x] Created `REFERRAL_IMPLEMENTATION_CHECKLIST.md`

## ⏳ To Be Done (By User)

### 1. Database Migration
```bash
cd my-ecommerce
supabase db push
```
**OR** manually run the SQL in Supabase Dashboard → SQL Editor

### 2. Testing
Start the development server and test:
```bash
npm run dev
```

Test checklist:
- [ ] Create a test user and promo code
- [ ] Sign up new user with promo code
- [ ] Verify referral relationship created
- [ ] Make 5M+ purchase (simulate 30-day period)
- [ ] Verify referrer receives 2% discount
- [ ] Make 30M+ purchases to enable discount usage
- [ ] Use discount at checkout
- [ ] Admin: Add user to Top 6
- [ ] Admin: View analytics
- [ ] Verify all stats update correctly

### 3. Deploy to Production
```bash
npm run build
npm run deploy
```

### 4. Post-Deployment Verification
- [ ] Verify migration applied successfully in Supabase
- [ ] Test signup with promo code in production
- [ ] Test discount earning flow
- [ ] Test discount usage flow
- [ ] Test admin Top 6 management
- [ ] Monitor Cloudflare/Supabase logs for errors

## ⚠️ Optional/Future Enhancements

### Realtime Features (Durable Objects)
- [ ] Implement `ReferralRoomDO` Durable Object
- [ ] Create `/api/ws/referral` WebSocket endpoint
- [ ] Create `useReferralRealtime` hook
- [ ] Integrate realtime updates in components

**Note:** Current implementation works without realtime. Stats refresh on page load/navigation.

### Network Visualization
- [ ] Install `react-flow` or `d3.js`
- [ ] Create `ReferralNetworkViewer` component
- [ ] Build interactive tree/graph visualization
- [ ] Add to admin dashboard

### Payment Integration (Coins)
- [ ] Integrate real payment gateway (QPay, Stripe, etc.)
- [ ] Update coin purchase API with actual payment processing
- [ ] Add payment verification
- [ ] Handle payment webhooks

## 🚀 Quick Start Commands

```bash
# Apply database migration
supabase db push

# Start development
npm run dev

# Build for production
npm run build

# Deploy
npm run deploy

# Check for TypeScript errors
npx tsc --noEmit

# Check for linter errors
npm run lint
```

## 📊 System Rules Summary

**Earning Discount:**
1. User signs up with friend's promo code → creates referral
2. Referred user spends 5M+ MNT in last 30 days → triggers reward
3. Referrer gets +2% discount (unlimited accumulation)

**Using Discount:**
1. User must have spent 30M+ MNT in last 30 days
2. Can use accumulated discount at checkout
3. Discount is one-time use per checkout

**Top 6:**
- Admin manually selects 6 members
- Used for tracking only (not displayed publicly)
- Can be changed anytime

## ❓ Troubleshooting

### Migration Fails
```bash
# Check current migration status
supabase db diff

# Reset database (⚠️ CAUTION: Deletes all data)
supabase db reset
```

### Promo Code Not Working
1. Check Supabase logs for errors
2. Verify `is_promo_code_available()` function exists
3. Check RLS policies on `referrals` table

### Discount Not Awarded
1. Verify 30-day purchase calculation is correct
2. Check `award_referral_discount()` function logs
3. Ensure `discount_events` table has proper policies

### Stats Not Loading
1. Check browser console for API errors
2. Verify `/api/referral/stats` returns 200
3. Check authentication state

## 📞 Need Help?

- Check `/REFERRAL_SYSTEM_SUMMARY.md` for detailed documentation
- Review Supabase Dashboard logs
- Check Cloudflare Workers logs
- Inspect browser network tab for API errors

---

**Status:** ✅ **IMPLEMENTATION COMPLETE** - Ready for testing and deployment!
