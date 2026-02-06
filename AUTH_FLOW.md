# Authentication Flow - Quick Reference

## New Pages Created

1. **`/verify-otp`** - OTP verification page
   - Accepts 6-digit OTP codes
   - Used for both signup verification and password recovery
   - Auto-focuses between input fields
   - Includes resend functionality with 60s cooldown

2. **`/forgot-password`** - Password recovery initiation
   - User enters email address
   - Sends OTP to email
   - Redirects to `/verify-otp?type=recovery`

3. **`/reset-password`** - New password creation
   - Accessible after OTP verification
   - Password confirmation required
   - Redirects to login on success

## Modified Pages

1. **`/signup`**
   - Now redirects to `/verify-otp` instead of showing message
   - Email and type passed as URL params

2. **`/login`**
   - Added "Forgot password?" link
   - Shows success messages for:
     - Email verification (`?verified=true`)
     - Password reset (`?reset=success`)

## User Flows

### Complete Signup Flow
```
/signup
  ↓ (fill form)
  ↓ (submit)
/verify-otp?email=user@example.com&type=signup
  ↓ (receive email)
  ↓ (enter 6-digit OTP)
  ↓ (verify)
/login?verified=true
  ↓ (success message shown)
  ↓ (enter credentials)
/strategies (dashboard)
```

### Forgot Password Flow
```
/login
  ↓ (click "Forgot password?")
/forgot-password
  ↓ (enter email)
  ↓ (submit)
/verify-otp?email=user@example.com&type=recovery
  ↓ (receive email)
  ↓ (enter 6-digit OTP)
  ↓ (verify)
/reset-password
  ↓ (enter new password)
  ↓ (submit)
/login?reset=success
  ↓ (success message shown)
  ↓ (enter new credentials)
/strategies (dashboard)
```

## Supabase Configuration Required

### 1. Enable Email OTP
In Supabase Dashboard:
- Go to **Authentication** > **Settings** > **Auth Providers**
- Find **Email** provider
- Enable these options:
  - ✅ Confirm email
  - ✅ Email OTP
  - ✅ Secure email change

### 2. Configure Email Templates
Go to **Authentication** > **Email Templates** and customize:

#### Confirm Signup Template
```html
<h2>Verify your email</h2>
<p>Your verification code is:</p>
<h1>{{ .Token }}</h1>
<p>This code expires in 60 seconds.</p>
```

#### Magic Link Template (for recovery)
```html
<h2>Reset your password</h2>
<p>Your recovery code is:</p>
<h1>{{ .Token }}</h1>
<p>This code expires in 60 seconds.</p>
```

### 3. Update Site URL
In **Authentication** > **URL Configuration**:
- **Site URL**: `https://your-domain.com` (or Vercel URL)
- **Redirect URLs** (add all these):
  ```
  http://localhost:3000/verify-otp
  http://localhost:3000/reset-password
  http://localhost:3000/login
  https://your-domain.com/verify-otp
  https://your-domain.com/reset-password
  https://your-domain.com/login
  ```

## Testing Locally

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Test signup:
   - Go to http://localhost:3000/signup
   - Fill form and submit
   - Check console/email for OTP
   - Enter OTP on verification page

3. Test forgot password:
   - Go to http://localhost:3000/login
   - Click "Forgot password?"
   - Enter email
   - Check console/email for OTP
   - Enter OTP and set new password

## Common Issues

### OTP Not Received
- Check Supabase logs in Dashboard
- Verify Email OTP is enabled
- Check spam folder
- For development: Check Supabase logs for OTP code

### Invalid OTP Error
- OTP expires in 60 seconds
- Can only be used once
- Check for typos
- Use resend button if expired

### Redirect Issues
- Verify all URLs are in Supabase redirect whitelist
- Check browser console for errors
- Ensure environment variables are set

## Environment Variables Checklist

Required in `.env.local`:
```bash
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ MANUS_API_KEY
✅ GHL_API_KEY (optional)
✅ GHL_LOCATION_ID (optional)
```

## Production Deployment

1. **Build and test**:
   ```bash
   npm run build
   npm run start
   ```

2. **Deploy to Vercel**:
   - Push to GitHub
   - Import in Vercel
   - Add environment variables
   - Deploy

3. **Post-deployment**:
   - Update Supabase Site URL with Vercel domain
   - Add Vercel URLs to redirect whitelist
   - Test complete auth flows
   - Monitor Supabase logs

## Security Notes

- OTP codes expire in 60 seconds
- One-time use only
- Rate limiting applied by Supabase
- All auth requests go through Supabase's secure endpoints
- Passwords hashed with bcrypt
- HTTPS required in production
