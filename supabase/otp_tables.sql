-- Create pending_users table for storing unverified signups
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

-- Create pending_password_resets table for password recovery
CREATE TABLE IF NOT EXISTS pending_password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp TEXT NOT NULL,
    otp_expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_pending_users_email ON pending_users(email);
CREATE INDEX IF NOT EXISTS idx_pending_users_otp ON pending_users(otp);
CREATE INDEX IF NOT EXISTS idx_pending_password_resets_email ON pending_password_resets(email);
CREATE INDEX IF NOT EXISTS idx_pending_password_resets_otp ON pending_password_resets(otp);

-- Add RLS policies
ALTER TABLE pending_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_password_resets ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage these tables (used by API routes)
CREATE POLICY "Service role can manage pending_users" ON pending_users
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage pending_password_resets" ON pending_password_resets
    FOR ALL USING (auth.role() = 'service_role');

-- Cleanup function to remove expired OTPs (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
    DELETE FROM pending_users WHERE otp_expires_at < NOW();
    DELETE FROM pending_password_resets WHERE otp_expires_at < NOW() AND verified = FALSE;
    DELETE FROM pending_password_resets WHERE updated_at < NOW() - INTERVAL '1 hour' AND verified = TRUE;
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a cron job to clean up expired OTPs (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-otps', '*/15 * * * *', 'SELECT cleanup_expired_otps()');
