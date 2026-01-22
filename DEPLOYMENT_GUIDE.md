# Referral System Deployment Guide

## Pre-Deployment Checklist

### 1. Database Migration
Ensure the referral system migration is applied to your Supabase database.

```bash
# Navigate to project directory
cd my-ecommerce

# Apply migration using Supabase CLI
supabase db push

# OR manually in Supabase Dashboard
# 1. Go to Supabase Dashboard → SQL Editor
# 2. Copy contents of: supabase/migrations/20260122000001_referral_system.sql
# 3. Execute the SQL
```

### 2. Verify Environment Variables
Check that all required environment variables are set:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

**Optional (for Cloudflare Images):**
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_IMAGES_API_TOKEN`

### 3. Build and Test Locally

```bash
# Install dependencies (if not already done)
npm install

# Run type checking
npx tsc --noEmit

# Run linter
npm run lint

# Build the project
npm run build

# Test the build locally
npm run start

# OR for development
npm run dev
```

## Deployment to Cloudflare Pages

### Method 1: Using Wrangler CLI

```bash
# Install Wrangler globally (if not installed)
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy .open-next/static --project-name=your-project-name

# OR using custom deploy script
npm run deploy
```

### Method 2: Using Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages**
3. Click **Create Application** → **Pages** → **Upload Assets**
4. Upload the `.open-next/static` directory
5. Configure environment variables in Settings

### Method 3: Git Integration (Recommended)

1. Push your code to GitHub/GitLab
2. Connect repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set build output directory: `.open-next/static`
5. Add environment variables in dashboard
6. Deploy

## Durable Objects Deployment (Realtime Features)

### 1. Deploy Durable Object Worker

```bash
# Create a separate worker for Durable Objects
wrangler publish src/workers/referral-room.ts --name referral-room

# Configure Durable Objects in Cloudflare Dashboard
# 1. Go to Workers & Pages → referral-room
# 2. Settings → Bindings → Durable Objects
# 3. Add binding: REFERRAL_ROOM → ReferralRoomDO
```

### 2. Update Main Worker

Ensure `wrangler.toml` includes the Durable Object binding:

```toml
[[durable_objects.bindings]]
name = "REFERRAL_ROOM"
class_name = "ReferralRoomDO"
script_name = "referral-room"
```

### 3. Test WebSocket Connection

```bash
# After deployment, test WebSocket endpoint
wscat -c wss://your-domain.pages.dev/api/ws/referral?userId=test-user-id

# Should receive connection confirmation
```

## Post-Deployment Verification

### 1. Database Verification

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('referrals', 'discount_events');

-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name IN (
    'get_user_purchases_last_30_days',
    'award_referral_discount',
    'is_promo_code_available',
    'get_referral_stats'
  );

-- Check if profiles has new columns
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'profiles'
  AND column_name IN (
    'is_top6',
    'promo_code',
    'accumulated_discount_percent',
    'total_referrals'
  );
```

### 2. API Endpoints Check

Test all API endpoints:

```bash
# Test promo code creation (requires auth)
curl -X POST https://your-domain.pages.dev/api/referral/create-code \
  -H "Content-Type: application/json" \
  -d '{"promoCode": "TEST123"}'

# Test referral stats (requires auth)
curl https://your-domain.pages.dev/api/referral/stats

# Test admin endpoints (requires admin auth)
curl https://your-domain.pages.dev/api/admin/top6
curl https://your-domain.pages.dev/api/admin/referral-analytics
```

### 3. Frontend Verification

Visit and test:
- [ ] `/auth/signup` - Promo code input visible
- [ ] `/profile?tab=promo` - Promo code management
- [ ] `/checkout` - Discount selector (for users with 30M+ purchases)
- [ ] `/admin/referral/top6` - Top 6 management
- [ ] `/admin/referral/analytics` - Analytics dashboard
- [ ] `/admin/referral/network` - Network viewer

## Monitoring and Logging

### Cloudflare Logs

```bash
# Tail worker logs
wrangler tail

# View specific time range
wrangler tail --since 2h
```

### Supabase Logs

1. Go to Supabase Dashboard → Logs
2. Check for:
   - SQL query errors
   - Function execution errors
   - RLS policy violations

### Application Monitoring

Monitor these metrics:
- Referral creation rate
- Discount award success rate
- WebSocket connection stability
- API response times

## Troubleshooting

### Issue: Migration Fails

**Solution:**
```bash
# Check migration status
supabase db diff

# If needed, reset and reapply
supabase db reset --db-url postgresql://...
supabase db push
```

### Issue: Promo Code Not Unique

**Solution:**
- Check `idx_profiles_promo_code` index exists
- Verify `UNIQUE` constraint on `promo_code` column
- Check for case-sensitivity issues (promo codes are uppercase)

### Issue: Discount Not Awarded

**Solution:**
1. Check `award_referral_discount()` function logs
2. Verify 30-day purchase calculation
3. Check referral relationship exists in `referrals` table
4. Ensure order status is 'confirmed' or 'delivered'

### Issue: WebSocket Not Connecting

**Solution:**
1. Verify Durable Object is deployed
2. Check `wrangler.toml` bindings
3. Ensure HTTPS is used (wss:// not ws://)
4. Check CORS settings

### Issue: Stats Not Loading

**Solution:**
1. Check browser console for errors
2. Verify API returns 200 status
3. Check authentication state
4. Review RLS policies

## Rollback Procedure

If issues occur, rollback steps:

### 1. Database Rollback

```sql
-- Remove new columns (CAUTION: Loses data)
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS is_top6,
DROP COLUMN IF EXISTS promo_code,
DROP COLUMN IF EXISTS accumulated_discount_percent,
DROP COLUMN IF EXISTS total_referrals;

-- Drop tables
DROP TABLE IF EXISTS public.discount_events CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS public.get_user_purchases_last_30_days;
DROP FUNCTION IF EXISTS public.award_referral_discount;
DROP FUNCTION IF EXISTS public.is_promo_code_available;
DROP FUNCTION IF EXISTS public.get_referral_stats;
```

### 2. Code Rollback

```bash
# Revert to previous commit
git revert HEAD

# Rebuild and redeploy
npm run build
npm run deploy
```

## Performance Optimization

### 1. Database Indexes

Ensure these indexes exist:
- `idx_profiles_promo_code`
- `idx_profiles_is_top6`
- `idx_referrals_user`
- `idx_referrals_referrer`
- `idx_discount_events_user`

### 2. Caching Strategy

Consider implementing:
- Redis for frequently accessed stats
- Cloudflare KV for promo code lookups
- R2 for aggregated analytics

### 3. Rate Limiting

Monitor and adjust rate limits:
- Promo code creation: 5 per hour
- Stats API: 60 per minute
- Admin APIs: 120 per minute

## Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Admin routes protected with `is_admin()` check
- [ ] Self-referral prevention in database
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (sanitized outputs)
- [ ] Rate limiting implemented
- [ ] HTTPS enforced
- [ ] Secrets not in code/git

## Maintenance Tasks

### Daily
- Monitor error logs
- Check discount award success rate

### Weekly
- Review referral growth metrics
- Check for spam/abuse patterns
- Verify data integrity

### Monthly
- Archive old discount_events (keep last 6 months)
- Review and optimize database queries
- Update analytics reports

## Support Contacts

- **Cloudflare Support**: https://dash.cloudflare.com/support
- **Supabase Support**: https://supabase.com/support
- **Documentation**: See REFERRAL_SYSTEM_SUMMARY.md

---

## Quick Commands Reference

```bash
# Development
npm run dev

# Build
npm run build

# Deploy
npm run deploy

# Database
supabase db push
supabase db diff
supabase db reset

# Logs
wrangler tail
wrangler pages deployment tail

# Testing
npm run lint
npx tsc --noEmit
```

## Next Steps After Deployment

1. ✅ Verify migration applied
2. ✅ Test signup with promo code
3. ✅ Create test referral chain
4. ✅ Test discount earning (5M threshold)
5. ✅ Test discount usage (30M threshold)
6. ✅ Verify admin Top 6 management
7. ✅ Check analytics accuracy
8. ✅ Monitor for 24 hours
9. ✅ Document any issues
10. ✅ Update stakeholders

**Deployment Status:** Ready for production! 🚀
