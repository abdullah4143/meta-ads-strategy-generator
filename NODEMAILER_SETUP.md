# Nodemailer Email Setup Guide

## Overview

This application uses **Nodemailer** for sending OTP verification emails instead of relying on Supabase's email service. This provides:
- ✅ Full control over email templates
- ✅ Better deliverability in production
- ✅ Support for any SMTP provider
- ✅ Custom branding and styling
- ✅ No dependency on Supabase email limits

## Quick Setup

### 1. Database Setup

Run the SQL migration to create required tables:

```sql
-- In Supabase SQL Editor, run:
\i supabase/otp_tables.sql
```

Or manually create tables using the [otp_tables.sql](../supabase/otp_tables.sql) file.

### 2. Environment Variables

Add these to your `.env.local`:

```bash
# Email Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_NAME=MetaGen
SMTP_FROM_EMAIL=your_email@gmail.com

# Site URL (for email links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## SMTP Provider Setup

### Option 1: Gmail (Development)

1. **Enable 2-Factor Authentication** in your Google account
2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated password

3. **Configure**:
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your.email@gmail.com
   SMTP_PASSWORD=your_16_char_app_password
   ```

**Limitations**: 
- 500 emails/day limit
- Not recommended for production
- May have deliverability issues

### Option 2: SendGrid (Recommended for Production)

1. **Create Account**: https://sendgrid.com/
2. **Create API Key**: Settings → API Keys → Create API Key
3. **Verify Domain** (optional but recommended)

4. **Configure**:
   ```bash
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=apikey
   SMTP_PASSWORD=your_sendgrid_api_key
   SMTP_FROM_EMAIL=noreply@yourdomain.com
   ```

**Benefits**:
- 100 emails/day free tier
- Excellent deliverability
- Analytics dashboard
- Scalable

### Option 3: AWS SES (Cost-Effective for Scale)

1. **Create AWS Account**
2. **Verify Email/Domain** in SES console
3. **Get SMTP Credentials**: SMTP Settings → Create SMTP Credentials

4. **Configure**:
   ```bash
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_aws_access_key
   SMTP_PASSWORD=your_aws_secret_key
   SMTP_FROM_EMAIL=noreply@yourdomain.com
   ```

**Benefits**:
- $0.10 per 1,000 emails
- High deliverability
- AWS ecosystem integration

### Option 4: Resend (Modern Alternative)

1. **Create Account**: https://resend.com/
2. **Get API Key**
3. **Configure** (requires minor code changes to use their SDK)

### Option 5: Mailgun

1. **Create Account**: https://mailgun.com/
2. **Verify Domain**
3. **Get SMTP Credentials**

4. **Configure**:
   ```bash
   SMTP_HOST=smtp.mailgun.org
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=postmaster@your-domain.mailgun.org
   SMTP_PASSWORD=your_mailgun_password
   ```

## Testing Locally

1. **Start Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Signup Flow**:
   - Go to http://localhost:3000/signup
   - Fill out the form
   - Check your email for the OTP code
   - Enter OTP to complete signup

3. **Check Logs**:
   - Terminal will show: "Email sent: <message-id>"
   - Any errors will be logged to console

## Email Template Customization

Edit the HTML template in [lib/email.ts](../lib/email.ts):

```typescript
export function getVerificationEmailHTML(otp: string, type: 'signup' | 'recovery') {
    // Customize your email HTML here
    // Current template includes:
    // - Branded header with gradient
    // - Large OTP display
    // - Professional styling
    // - Mobile-responsive design
}
```

## API Routes

### POST `/api/auth/send-otp`
Generates and sends OTP code

**Request**:
```json
{
  "email": "user@example.com",
  "type": "signup" | "recovery",
  "password": "...",  // Required for signup
  "firstName": "...", // Required for signup
  "lastName": "..."   // Required for signup
}
```

**Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### POST `/api/auth/verify-otp`
Verifies OTP and creates account/allows password reset

**Request**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "type": "signup" | "recovery"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Account created successfully"
}
```

### POST `/api/auth/reset-password`
Resets user password after OTP verification

**Request**:
```json
{
  "email": "user@example.com",
  "password": "new_password"
}
```

## Production Deployment

### Vercel Environment Variables

Add these in your Vercel project settings:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Email (use SendGrid or SES for production)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxx
SMTP_FROM_NAME=MetaGen
SMTP_FROM_EMAIL=noreply@yourdomain.com

# Site URL
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app

# Other APIs
MANUS_API_KEY=xxx
GHL_API_KEY=xxx
GHL_LOCATION_ID=xxx
```

### Domain Configuration

1. **Verify Domain** with your SMTP provider (SendGrid/SES)
2. **Add DNS Records** (SPF, DKIM, DMARC)
3. **Test Email Deliverability**: https://www.mail-tester.com/

### Best Practices

✅ **Use a dedicated sending domain** (e.g., `noreply@yourdomain.com`)
✅ **Implement rate limiting** on OTP endpoints
✅ **Monitor email delivery** rates
✅ **Set up email analytics**
✅ **Test spam score** before launch
✅ **Implement DMARC policy**

## Troubleshooting

### Emails Not Sending

1. **Check Logs**:
   ```bash
   # Look for errors in terminal
   npm run dev
   ```

2. **Verify SMTP Credentials**:
   - Test with a simple script
   - Check firewall/port access

3. **Check Email Provider Dashboard**:
   - SendGrid: Activity feed
   - AWS SES: Sending Statistics

### Emails Going to Spam

1. **Verify Domain** with SMTP provider
2. **Add SPF Record**:
   ```
   v=spf1 include:sendgrid.net ~all
   ```
3. **Add DKIM Records** (provided by email service)
4. **Set up DMARC**:
   ```
   v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
   ```

### OTP Expired

- Default expiry: 5 minutes
- Change in `lib/email.ts`:
  ```typescript
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  ```

### Database Errors

- Run the migration: `supabase/otp_tables.sql`
- Check RLS policies are enabled
- Verify service role has access

## Monitoring

### Email Delivery Tracking

Add to your SMTP provider:
- **SendGrid**: Events API
- **AWS SES**: CloudWatch metrics
- **Mailgun**: Event webhooks

### Database Cleanup

Run periodically to remove expired OTPs:

```sql
SELECT cleanup_expired_otps();
```

Or set up a cron job (requires pg_cron extension):
```sql
SELECT cron.schedule('cleanup-expired-otps', '*/15 * * * *', 'SELECT cleanup_expired_otps()');
```

## Migration from Supabase Auth Emails

If migrating from Supabase's built-in email:

1. ✅ Database tables created
2. ✅ API routes implemented
3. ✅ Frontend updated
4. ✅ Nodemailer configured
5. ⚠️ Old Supabase email templates can be disabled

The system is now independent of Supabase email service!

## Support

For issues or questions:
- Check [GitHub Issues](https://github.com/your-repo/issues)
- Review [Nodemailer Docs](https://nodemailer.com/)
- Check your SMTP provider's documentation
