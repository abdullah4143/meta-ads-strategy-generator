import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { email, otp, type } = await request.json();

        if (!email || !otp || !type) {
            return NextResponse.json(
                { error: 'Email, OTP, and type are required' },
                { status: 400 }
            );
        }

        const supabase = createAdminClient();

        if (type === 'signup') {
            // Verify OTP for signup
            const { data: pendingUser, error } = await supabase
                .from('pending_users')
                .select('*')
                .eq('email', email.toLowerCase().trim())
                .single();

            if (error || !pendingUser) {
                console.error('Pending user lookup error:', error);
                return NextResponse.json(
                    { error: 'Invalid or expired OTP' },
                    { status: 400 }
                );
            }

            // Check OTP match (case-insensitive, trimmed)
            if (pendingUser.otp.trim() !== otp.trim()) {
                console.error('OTP mismatch:', { provided: otp, stored: pendingUser.otp });
                return NextResponse.json(
                    { error: 'Invalid or expired OTP' },
                    { status: 400 }
                );
            }

            // Check if OTP is expired
            const expiresAt = new Date(pendingUser.otp_expires_at);
            const now = new Date();
            console.log('OTP expiry check:', { expiresAt, now, isExpired: expiresAt < now });
            
            if (expiresAt < now) {
                return NextResponse.json(
                    { error: 'OTP has expired' },
                    { status: 400 }
                );
            }

            // Create actual user account
            const { data: authData, error: signupError } = await supabase.auth.signUp({
                email: pendingUser.email,
                password: pendingUser.password_hash,
                options: {
                    data: {
                        first_name: pendingUser.first_name,
                        last_name: pendingUser.last_name,
                    },
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`,
                },
            });

            if (signupError) {
                return NextResponse.json(
                    { error: signupError.message },
                    { status: 400 }
                );
            }

            // Delete pending user record
            await supabase
                .from('pending_users')
                .delete()
                .eq('email', email);

            return NextResponse.json({
                success: true,
                message: 'Account created successfully',
            });

        } else if (type === 'recovery') {
            // Verify OTP for password recovery
            const { data: resetRequest, error } = await supabase
                .from('pending_password_resets')
                .select('*')
                .eq('email', email.toLowerCase().trim())
                .single();

            if (error || !resetRequest) {
                console.error('Reset request lookup error:', error);
                return NextResponse.json(
                    { error: 'Invalid or expired OTP' },
                    { status: 400 }
                );
            }

            // Check OTP match (case-insensitive, trimmed)
            if (resetRequest.otp.trim() !== otp.trim()) {
                console.error('OTP mismatch:', { provided: otp, stored: resetRequest.otp });
                return NextResponse.json(
                    { error: 'Invalid or expired OTP' },
                    { status: 400 }
                );
            }

            // Check if OTP is expired
            const expiresAt = new Date(resetRequest.otp_expires_at);
            const now = new Date();
            console.log('OTP expiry check:', { expiresAt, now, isExpired: expiresAt < now });
            
            if (expiresAt < now) {
                return NextResponse.json(
                    { error: 'OTP has expired' },
                    { status: 400 }
                );
            }

            // Create a temporary session for password reset
            // Mark the reset request as verified
            await supabase
                .from('pending_password_resets')
                .update({ verified: true })
                .eq('email', email);

            return NextResponse.json({
                success: true,
                message: 'OTP verified successfully',
                email: email, // Send back email for reset password page
            });
        }

        return NextResponse.json(
            { error: 'Invalid type' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
