# Vercel Deployment Configuration

## Required Environment Variables

Add these environment variables in your Vercel project settings:

### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Email Configuration (Nodemailer)
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
SMTP_FROM_NAME=MetaGen
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

**Note**: For production, use SendGrid, AWS SES, or another professional SMTP service. See [NODEMAILER_SETUP.md](./NODEMAILER_SETUP.md) for detailed setup instructions.

### GoHighLevel Configuration
```
GHL_API_KEY=your_ghl_api_key
GHL_LOCATION_ID=your_ghl_location_id
```

### Manus AI Configuration
```
MANUS_API_KEY=your_manus_api_key
```

### Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

## Database Setup

### 1. Run OTP Tables Migration

In your Supabase SQL Editor, run:

```sql
-- Create tables for OTP storage
\i supabase/otp_tables.sql
```

Or manually execute the SQL from [supabase/otp_tables.sql](./supabase/otp_tables.sql).

This creates:
- `pending_users` - Stores unverified signup data
- `pending_password_resets` - Stores password reset requests
- Indexes for fast OTP lookups
- Cleanup function for expired OTPs

### 2. Supabase Configuration

**No email templates needed!** This app uses Nodemailer for all email sending.

However, you still need to:
1. Keep Supabase Auth enabled for user management
2. Ensure Row Level Security (RLS) is configured
3. Verify the service role has access to auth tables

## Email Provider Setup

See [NODEMAILER_SETUP.md](./NODEMAILER_SETUP.md) for complete instructions.

### Quick Start with SendGrid (Recommended)

1. **Create SendGrid Account**: https://sendgrid.com/
2. **Create API Key**: Settings → API Keys
3. **Verify Domain** (optional for better deliverability)
4. **Add to Vercel**:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=SG.your_api_key_here
   ```

### Testing Email Locally

Use Gmail with App Password for development:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
```

## Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add OTP verification and forgot password flow"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables
   - Deploy

3. **Update Supabase Redirect URLs**
   - Go to Supabase Dashboard > Authentication > URL Configuration
   - Add your Vercel domain to **Site URL**:
     ```
     https://your-app.vercel.app
     ```
   - Add to **Redirect URLs**:
     ```
     https://your-app.vercel.app/verify-otp
     https://your-app.vercel.app/reset-password
     https://your-app.vercel.app/login
     ```

## Testing the Auth Flow

### Signup with OTP Verification (Nodemailer)
1. Navigate to `/signup`
2. Fill in user details
3. Submit form → Redirects to `/verify-otp`
4. Check email for 6-digit OTP code (sent via Nodemailer)
5. Enter OTP → Account created → Redirects to `/login`

### Forgot Password (Nodemailer)
1. Navigate to `/login`
2. Click "Forgot password?"
3. Enter email → Redirects to `/verify-otp?type=recovery`
4. Check email for recovery OTP
5. Enter OTP → Redirects to `/reset-password`
6. Set new password → Redirects to `/login`

### Email Customization
- Edit templates in `lib/email.ts`
- Professional HTML design included
- Fully customizable branding

## Troubleshooting

### Emails Not Sending
- Check Vercel logs for SMTP errors
- Verify SMTP credentials are correct
- Test with mail-tester.com
- Check email provider dashboard (SendGrid/SES)

### OTP Not Working
- Check database tables exist (`pending_users`, `pending_password_resets`)
- Verify OTP hasn't expired (5 minute default)
- Check Supabase logs for database errors
- Ensure RLS policies allow service role access

### Vercel Build Fails
- Ensure all environment variables are set
- Check build logs for specific errors
- Verify `next.config.ts` has `ignoreBuildErrors: true` for TypeScript

## Production Checklist

- [ ] All environment variables configured in Vercel
- [ ] Supabase redirect URLs updated with production domain
- [ ] Email OTP enabled in Supabase
- [ ] SMTP configured for reliable email delivery
- [ ] Rate limiting configured for auth endpoints
- [ ] Custom email templates configured
- [ ] Password policies configured (min length, complexity)
- [ ] Test complete signup and password reset flows
