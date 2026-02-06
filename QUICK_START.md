# 🚀 Quick Start with Nodemailer

## ⚡ 5-Minute Setup

### 1. Install Dependencies ✅ (Already Done)
```bash
npm install nodemailer @types/nodemailer
```

### 2. Create Database Tables (REQUIRED!)

Copy and run this SQL in your Supabase SQL Editor:

```sql
-- Create pending_users table
CREATE TABLE IF NOT EXISTS pending_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    otp TEXT NOT NULL,
    otp_expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create pending_password_resets table
CREATE TABLE IF NOT EXISTS pending_password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp TEXT NOT NULL,
    otp_expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_pending_users_email ON pending_users(email);
CREATE INDEX IF NOT EXISTS idx_pending_users_otp ON pending_users(otp);
CREATE INDEX IF NOT EXISTS idx_pending_password_resets_email ON pending_password_resets(email);
CREATE INDEX IF NOT EXISTS idx_pending_password_resets_otp ON pending_password_resets(otp);

-- Enable RLS
ALTER TABLE pending_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_password_resets ENABLE ROW LEVEL SECURITY;

-- Allow service role access
CREATE POLICY "Service role can manage pending_users" ON pending_users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage pending_password_resets" ON pending_password_resets
    FOR ALL USING (auth.role() = 'service_role');
```

### 3. Get Gmail App Password (For Development)

1. Go to https://myaccount.google.com/apppasswords
2. Enable 2FA if not enabled
3. Create new app password for "Mail"
4. Copy the 16-character password

### 4. Add to .env.local

```bash
# Email (Gmail for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your.email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx  # Your 16-char app password
SMTP_FROM_NAME=MetaGen
SMTP_FROM_EMAIL=your.email@gmail.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Keep your existing Supabase variables
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
MANUS_API_KEY=...
```

### 5. Test It!

```bash
npm run dev
```

Then:
1. Open http://localhost:3000/signup
2. Fill out the form
3. Check your Gmail inbox for the OTP
4. Enter OTP → Account created! 🎉

## 🎯 What Happens When You Sign Up

```mermaid
User → Signup Form
  ↓
  POST /api/auth/send-otp
  ↓
  Generate 6-digit OTP
  ↓
  Store in pending_users table
  ↓
  Send email via Nodemailer
  ↓
  User receives email → Enters OTP
  ↓
  POST /api/auth/verify-otp
  ↓
  Verify OTP from database
  ↓
  Create Supabase auth user
  ↓
  Delete pending_users record
  ↓
  Redirect to login ✅
```

## 📧 Email Preview

Your users will receive a beautiful email like this:

```
┌──────────────────────────────────────┐
│   📧 Verify Your Email              │
│   Welcome to MetaGen!               │
├──────────────────────────────────────┤
│                                      │
│   YOUR VERIFICATION CODE             │
│                                      │
│        🔢  1 2 3 4 5 6              │
│                                      │
│   This code expires in 5 minutes    │
│                                      │
└──────────────────────────────────────┘
```

## 🔥 Production Setup (SendGrid)

### Free 100 emails/day - Perfect for MVP!

1. **Create SendGrid account**: https://sendgrid.com/
2. **Get API Key**: Settings → API Keys → Create
3. **Update .env.local** (or Vercel env vars):

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_api_key_here
SMTP_FROM_NAME=MetaGen
SMTP_FROM_EMAIL=noreply@yourdomain.com
```

4. **Deploy to Vercel**:
```bash
git add .
git commit -m "Add Nodemailer OTP system"
git push
```

Done! 🚀

## 🐛 Troubleshooting

### Email Not Sending?
```bash
# Check terminal logs for errors
npm run dev

# Look for: "Email sent: <message-id>"
# Or errors like: "Authentication failed"
```

### Common Issues:

**"Invalid login"**
- Check Gmail app password is correct (16 chars, no spaces)
- Verify 2FA is enabled on Google account

**"Database error"**
- Run the SQL migration in Supabase
- Check tables exist: `pending_users`, `pending_password_resets`

**"OTP expired"**
- OTPs expire in 5 minutes
- Click "Resend Code" to get a new one

## ✨ Features

- ✅ Beautiful HTML emails with branding
- ✅ 6-digit OTP codes
- ✅ 5-minute expiration
- ✅ Resend functionality
- ✅ Mobile-responsive design
- ✅ Works with any SMTP provider
- ✅ Professional templates

## 📚 More Info

- **Full Setup Guide**: [NODEMAILER_SETUP.md](./NODEMAILER_SETUP.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Implementation Details**: [NODEMAILER_IMPLEMENTATION.md](./NODEMAILER_IMPLEMENTATION.md)

---

**That's it!** You now have a production-ready email verification system with Nodemailer. 🎉

Need help? Check the detailed guides above or create an issue.
