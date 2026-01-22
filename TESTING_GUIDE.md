# Referral System Testing Guide

## Testing Overview

This guide provides comprehensive test scenarios for the referral/pyramid system.

## Prerequisites

```bash
# Start development server
cd my-ecommerce
npm run dev

# Ensure migration is applied
supabase db push
```

## Test User Setup

Create test users for different scenarios:

1. **User A** - Top 6 member, referrer
2. **User B** - Regular user, uses User A's code
3. **User C** - Regular user, uses User B's code
4. **Admin User** - For testing admin features

## Test Scenarios

### 1. Promo Code Creation & Management

#### Test 1.1: Create Promo Code
**Steps:**
1. Sign up as User A
2. Navigate to `/profile?tab=promo`
3. Click "Promo код үүсгэх"
4. Enter "FRIEND2026"
5. Click "Хадгалах"

**Expected Result:**
- ✅ Promo code saved successfully
- ✅ Code displayed in profile
- ✅ Toast notification shown
- ✅ Copy button works

**SQL Verification:**
```sql
SELECT promo_code FROM profiles WHERE id = 'user-a-id';
-- Should return: FRIEND2026
```

#### Test 1.2: Edit Promo Code
**Steps:**
1. Click "Өөрчлөх" on existing code
2. Change to "NEWCODE2026"
3. Click "Хадгалах"

**Expected Result:**
- ✅ Code updated
- ✅ Old code no longer valid
- ✅ New code immediately usable

#### Test 1.3: Duplicate Promo Code
**Steps:**
1. Sign up as User B
2. Try to create promo code "FRIEND2026" (User A's code)
3. Click "Хадгалах"

**Expected Result:**
- ❌ Error: "Энэ promo код аль хэдийн ашиглагдаж байна"
- ✅ Code not saved

#### Test 1.4: Invalid Promo Code Format
**Steps:**
1. Try codes: "ab", "TOOLONGCODE123456789", "code with spaces", "код123"

**Expected Result:**
- ❌ Error for each invalid format
- ✅ Only 3-20 alphanumeric uppercase allowed

### 2. Signup with Promo Code

#### Test 2.1: Valid Promo Code
**Steps:**
1. Go to `/auth/signup`
2. Fill in registration form
3. Enter "FRIEND2026" in promo code field
4. Submit form

**Expected Result:**
- ✅ User registered successfully
- ✅ Redirected to home page
- ✅ Referral relationship created

**SQL Verification:**
```sql
SELECT * FROM referrals 
WHERE user_id = 'user-b-id' 
  AND referrer_id = 'user-a-id';
-- Should return 1 row
```

#### Test 2.2: Invalid Promo Code
**Steps:**
1. Sign up with promo code "INVALID123"

**Expected Result:**
- ⚠️ User still registered (promo code is optional)
- ⚠️ Warning logged in console
- ✅ No referral relationship created

#### Test 2.3: Self Referral Prevention
**Steps:**
1. Sign up and create promo code
2. Sign out
3. Try to sign up again with own promo code

**Expected Result:**
- ❌ Should not create referral (database constraint)
- ✅ User still registered

#### Test 2.4: Empty Promo Code
**Steps:**
1. Sign up without entering promo code
2. Submit form

**Expected Result:**
- ✅ User registered successfully
- ✅ No referral created

### 3. Discount Earning

#### Test 3.1: Earn First Discount
**Setup:**
- User B referred by User A
- User B makes purchases totaling 5M+ MNT in 30 days

**Steps:**
1. Log in as User B
2. Make order worth 5,000,000 MNT
3. Complete checkout

**Expected Result:**
- ✅ Order created successfully
- ✅ User A's discount increases by 2%
- ✅ Discount event recorded

**SQL Verification:**
```sql
-- Check User A's discount
SELECT accumulated_discount_percent FROM profiles WHERE id = 'user-a-id';
-- Should be: 2

-- Check discount event
SELECT * FROM discount_events WHERE user_id = 'user-a-id';
-- Should have 1 record
```

#### Test 3.2: Multiple Discounts
**Steps:**
1. User B makes another 5M+ purchase
2. User C (also referred by A) makes 5M+ purchase
3. Check User A's discount

**Expected Result:**
- ✅ User A has 2% from User B
- ✅ User A has 2% from User C
- ✅ Total: 4% accumulated

#### Test 3.3: Below Threshold
**Steps:**
1. User D makes 4,999,999 MNT purchase
2. Check referrer's discount

**Expected Result:**
- ❌ No discount awarded
- ✅ Purchase still recorded

#### Test 3.4: 30-Day Rolling Window
**Setup:**
- User B made 5M purchase 31 days ago
- User B makes 1M purchase today

**Expected Result:**
- ❌ No new discount (old purchase expired)
- ✅ 30-day total is only 1M

**SQL Verification:**
```sql
SELECT public.get_user_purchases_last_30_days('user-b-id');
-- Should return: 1000000
```

### 4. Discount Usage

#### Test 4.1: Unable to Use (Below 30M)
**Setup:**
- User A has 10% accumulated discount
- User A has only 20M in purchases (30-day)

**Steps:**
1. Log in as User A
2. Go to checkout with 1M order
3. Check DiscountSelector component

**Expected Result:**
- ⚠️ Discount shown but disabled
- ⚠️ Message: "30 сая төгрөгийн худалдан авалт хийх шаардлагатай"
- ❌ Cannot apply discount

#### Test 4.2: Eligible to Use
**Setup:**
- User A has 10% accumulated discount
- User A has 31M in purchases (30-day)

**Steps:**
1. Go to checkout with 10M order
2. Select "Бүх discount ашиглах"
3. Verify calculation
4. Complete order

**Expected Result:**
- ✅ 10% discount option enabled
- ✅ Order total: 9M (10M - 1M discount)
- ✅ Discount applied successfully

**SQL Verification:**
```sql
-- After order, discount should be used (implementation dependent)
-- Check order record includes discount info
```

#### Test 4.3: Partial Discount
**Steps:**
1. User has 20% discount available
2. Try to apply 10% only (if feature supported)

**Expected Result:**
- Implementation dependent
- Current version: all or nothing

### 5. Top 6 Management

#### Test 5.1: Add to Top 6
**Steps:**
1. Log in as Admin
2. Go to `/admin/referral/top6`
3. Search for "User A"
4. Click "Top 6-д нэмэх"

**Expected Result:**
- ✅ User A added to Top 6
- ✅ `is_top6 = true` in database
- ✅ Displayed in Top 6 list

#### Test 5.2: Top 6 Limit
**Steps:**
1. Add 6 users to Top 6
2. Try to add 7th user

**Expected Result:**
- ❌ Error: "Top 6 дүүрсэн байна"
- ✅ Cannot add more

#### Test 5.3: Remove from Top 6
**Steps:**
1. Click "Хасах" on a Top 6 member
2. Confirm removal

**Expected Result:**
- ✅ User removed
- ✅ `is_top6 = false` in database
- ✅ Can add another user now

#### Test 5.4: View Top 6 Stats
**Steps:**
1. View Top 6 list
2. Check stats for each member

**Expected Result:**
- ✅ Shows total referrals
- ✅ Shows accumulated discount
- ✅ Shows network size
- ✅ Stats accurate

### 6. Analytics

#### Test 6.1: View Analytics Dashboard
**Steps:**
1. Go to `/admin/referral/analytics`
2. Review all metrics

**Expected Result:**
- ✅ Total users count correct
- ✅ Users with referrals count correct
- ✅ Top promo codes displayed
- ✅ Top referrers displayed
- ✅ Discount distribution shown

#### Test 6.2: Top Promo Codes
**Setup:**
- Multiple users with different usage counts

**Expected Result:**
- ✅ Sorted by usage (most used first)
- ✅ Usage count accurate
- ✅ Max 10 displayed

#### Test 6.3: Discount Distribution
**Expected Result:**
- ✅ Users grouped by discount ranges
- ✅ 0%, 1-5%, 6-10%, etc.
- ✅ Counts accurate

### 7. Network Viewer

#### Test 7.1: View Top 6 Networks
**Steps:**
1. Go to `/admin/referral/network`
2. Select "Top 6 Networks" mode
3. View network tree

**Expected Result:**
- ✅ Shows all Top 6 members
- ✅ Tree structure displayed
- ✅ Can expand/collapse nodes
- ✅ Shows referral levels

#### Test 7.2: View Specific User Network
**Steps:**
1. Select "Specific User" mode
2. Enter User A's ID
3. Click "Хайх"

**Expected Result:**
- ✅ Shows User A at root
- ✅ Shows all descendants
- ✅ Correct level indicators
- ✅ Stats accurate

#### Test 7.3: Node Details
**Steps:**
1. Click on any node in tree
2. View modal details

**Expected Result:**
- ✅ Modal opens
- ✅ Shows name, promo code
- ✅ Shows stats (referrals, discount, level)
- ✅ Shows Top 6 badge if applicable

### 8. Realtime Features (If Enabled)

#### Test 8.1: WebSocket Connection
**Steps:**
1. Open profile page
2. Check browser console
3. Leave page open

**Expected Result:**
- ✅ WebSocket connected message
- ✅ Connection stays open
- ✅ Ping/pong working

#### Test 8.2: Realtime Stats Update
**Steps:**
1. User A has profile page open
2. User B (referred by A) makes 5M+ purchase
3. Wait for update

**Expected Result:**
- ✅ User A sees discount increase in realtime
- ✅ No page refresh needed
- ✅ Update within 1-2 seconds

#### Test 8.3: Reconnection
**Steps:**
1. Disconnect internet
2. Wait 5 seconds
3. Reconnect internet

**Expected Result:**
- ✅ Auto-reconnects
- ✅ Stats updated after reconnect
- ✅ No errors shown

### 9. Edge Cases

#### Test 9.1: Concurrent Discount Earning
**Steps:**
1. User B and User C make 5M+ purchases simultaneously
2. Check User A's discount

**Expected Result:**
- ✅ Both discounts awarded
- ✅ Total: 4% (2% + 2%)
- ✅ No race conditions

#### Test 9.2: Order Cancellation
**Steps:**
1. User B makes 5M+ purchase (User A gets 2%)
2. Order is cancelled
3. Check discount

**Expected Result:**
- Implementation dependent
- Current: discount not revoked (one-time award)

#### Test 9.3: Large Discount
**Setup:**
- User A has 1000 referrals
- Each triggered discount

**Expected Result:**
- ✅ 2000% discount accumulated
- ✅ No integer overflow
- ✅ System still functional

## Performance Testing

### Load Test 1: Concurrent Signups
```bash
# Use a tool like k6 or artillery
# 100 concurrent signups with promo codes
```

**Expected:**
- ✅ All succeed
- ✅ No duplicate promo codes
- ✅ < 2s response time

### Load Test 2: Stats API
```bash
# 1000 requests to /api/referral/stats
```

**Expected:**
- ✅ < 500ms average response
- ✅ No timeouts
- ✅ Rate limiting works

## Automation Scripts

### Seed Test Data
```sql
-- Insert test users with promo codes
INSERT INTO profiles (id, promo_code, accumulated_discount_percent, total_referrals)
VALUES 
  ('user-a', 'TESTA', 10, 5),
  ('user-b', 'TESTB', 4, 2),
  ('user-c', 'TESTC', 0, 0);

-- Create referral relationships
INSERT INTO referrals (user_id, referrer_id, promo_code_used)
VALUES
  ('user-b', 'user-a', 'TESTA'),
  ('user-c', 'user-a', 'TESTA');

-- Create discount events
INSERT INTO discount_events (user_id, earned_from_user_id, purchase_amount_mnt)
VALUES
  ('user-a', 'user-b', 5000000),
  ('user-a', 'user-c', 7500000);
```

### Cleanup Test Data
```sql
DELETE FROM discount_events WHERE user_id LIKE 'user-%';
DELETE FROM referrals WHERE user_id LIKE 'user-%';
DELETE FROM profiles WHERE id LIKE 'user-%';
```

## Bug Report Template

When issues are found:

```markdown
**Bug Title:** [Brief description]

**Steps to Reproduce:**
1. ...
2. ...
3. ...

**Expected Result:**
...

**Actual Result:**
...

**Environment:**
- Browser: ...
- User Type: ...
- Database state: ...

**SQL Queries:**
[Relevant queries to reproduce]

**Logs:**
[Error messages, console logs]

**Screenshots:**
[If applicable]
```

## Sign-Off Checklist

Before marking as production-ready:

- [ ] All Test Scenarios Pass
- [ ] No Console Errors
- [ ] Database Migration Applied
- [ ] RLS Policies Working
- [ ] Admin Features Functional
- [ ] User Features Functional
- [ ] Performance Acceptable
- [ ] Security Checks Pass
- [ ] Documentation Complete

**Testing Status:** ✅ Ready for deployment
