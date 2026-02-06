# Meta Ads Strategy Generator

An AI-powered Meta (Facebook/Instagram) Ads strategy generator built with Next.js, Supabase, and Manus AI.

## Features

- 🤖 **AI-Powered Strategy Generation** - Uses Manus AI to create comprehensive Meta Ads strategies
- 🔐 **Secure Authentication** - OTP-based email verification and password reset with Nodemailer
- 📧 **Professional Emails** - Beautiful, customizable HTML email templates
- 📨 **Custom SMTP** - Use any email provider (Gmail, SendGrid, AWS SES, etc.)
- 🔄 **GHL Integration** - Syncs leads with GoHighLevel CRM
- 📊 **Strategy Dashboard** - View and manage all generated strategies
- 📄 **PDF Export** - Export strategies as professional PDFs
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## Quick Start

See [QUICK_START.md](./QUICK_START.md) for a 5-minute setup guide!

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account with a project
- Manus AI API key
- SMTP email account (Gmail, SendGrid, etc.)
- GoHighLevel API credentials (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd meta-ads-strategy-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your credentials:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Email (Nodemailer)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your.email@gmail.com
   SMTP_PASSWORD=your_app_password
   SMTP_FROM_NAME=MetaGen
   
   # APIs
   MANUS_API_KEY=your_manus_api_key
   GHL_API_KEY=your_ghl_api_key
   GHL_LOCATION_ID=your_ghl_location_id
   
   # Site URL (Nodemailer)
1. User fills out signup form at `/signup`
2. System generates 6-digit OTP and stores in database
3. OTP sent to email via Nodemailer (custom SMTP)
4. User enters OTP at `/verify-otp`
5. Account is created upon successful verification

### Forgot Password (Nodemailer)
1. User clicks "Forgot password?" on login page
2. Enters email at `/forgot-password`
3. Receives OTP code via Nodemailer
4. Verifies OTP at `/verify-otp?type=recovery`
5. Sets new password at `/reset-password`

**Email System**: Uses Nodemailer for full control over email templates and delivery. Supports any SMTP provider (Gmail, SendGrid, AWS SES, Mailgun, etc.).

See [NODEMAILER_SETUP.md](./NODEMAILER_SETUP.md) for detailed email configuration.

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## Authentication Flow

### Signup with OTP Verification
1. User fills out signup form at `/signup`
2. System generates and sends 6-digit OTP to email
3. User enters OTP at `/verify-otp`
4. Account is created upon successful verification

### Forgot Password
1. User clicks "Forgot password?" on login page
2. Enters email at `/forgot-password`
3. Receives OTP code via email
4. Verifies OTP at `/verify-otp?type=recovery`
5. Sets new password at `/reset-password`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Vercel.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

**Important**: Configure Supabase redirect URLs and enable Email OTP in Supabase Dashboard.

## Project Structure

```
app/
├── api/                    # API routes
│   ├── generate-strategy/  # Strategy generation endpoint
│   ├── ghl-sync/           # GHL sync endpoint
│   └── poll-task/          # Manus AI polling endpoint
├── forgot-password/        # Password recovery page
├── login/                  # Login page
├── questionnaire/          # Strategy questionnaire
├── reset-password/         # Password reset page
├── signup/                 # Signup page
├── strategies/             # Strategies list page
├── strategy/[id]/          # Individual strategy page
└── verify-otp/             # OTP verification page
components/                 # React components
hooks/                      # Custom React hooks
lib/                        # Utility functions
utils/supabase/             # Supabase client configuration
```
custom OTP via Nodemailer
- **Email**: Nodemailer (supports any SMTP provider)
- **Database**: Supabase (PostgreSQL)
- **AI**: Manus AI API
- **CRM**: GoHighLevel Integration
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Documentation

- **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup guide
- **[NODEMAILER_SETUP.md](./NODEMAILER_SETUP.md)** - Email configuration guide
- **[NODEMAILER_IMPLEMENTATION.md](./NODEMAILER_IMPLEMENTATION.md)** - Implementation details
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Vercel deployment guide
- **[AUTH_FLOW.md](./AUTH_FLOW.md)** - Authentication flow referenceabase Auth with OTP
- **Database**: Supabase (PostgreSQL)
- **AI**: Manus AI API
- **CRM**: GoHighLevel Integration
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Manus AI](https://manus.ai)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
