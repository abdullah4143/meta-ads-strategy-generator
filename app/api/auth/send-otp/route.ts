import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';
import { generateOTP, sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const { email, type, password, firstName, lastName } = await request.json();

        if (!email || !type) {
            return NextResponse.json(
                { error: 'Email and type are required' },
                { status: 400 }
            );
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        console.log('Generated OTP:', { email: normalizedEmail, otp, expiresAt: expiresAt.toISOString() });

        const supabase = createAdminClient();

        // For signup, create a pending user record
        if (type === 'signup') {
            if (!password || !firstName || !lastName) {
                return NextResponse.json(
                    { error: 'Password and name are required for signup' },
                    { status: 400 }
                );
            }

            // Check if email already exists
            const { data: existingUser } = await supabase
                .from('pending_users')
                .select('email')
                .eq('email', normalizedEmail)
                .single();

            if (existingUser) {
                // Update existing pending user
                await supabase
                    .from('pending_users')
                    .update({
                        otp,
                        otp_expires_at: expiresAt.toISOString(),
                        password_hash: password,
                        first_name: firstName,
                        last_name: lastName,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('email', normalizedEmail);
            } else {
                // Insert new pending user
                const { error: insertError } = await supabase
                    .from('pending_users')
                    .insert({
                        email: normalizedEmail,
                        otp,
                        otp_expires_at: expiresAt.toISOString(),
                        password_hash: password,
                        first_name: firstName,
                        last_name: lastName,
                    });
                
                if (insertError) {
                    console.error('Failed to insert pending user:', insertError);
                    return NextResponse.json(
                        { error: 'Failed to create pending user' },
                        { status: 500 }
                    );
                }
            }
        } else if (type === 'recovery') {
            // For password recovery, check if user exists
            const { data: existingUser, error: userError } = await supabase
                .from('pending_password_resets')
                .select('email')
                .eq('email', normalizedEmail)
                .single();

            if (existingUser) {
                // Update existing reset request
                await supabase
                    .from('pending_password_resets')
                    .update({
                        otp,
                        otp_expires_at: expiresAt.toISOString(),
                        verified: false,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('email', normalizedEmail);
            } else {
                // Insert new reset request
                await supabase
                    .from('pending_password_resets')
                    .insert({
                        email: normalizedEmail,
                        otp,
                        otp_expires_at: expiresAt.toISOString(),
                    });
            }
        }

        // Send OTP email
        const emailResult = await sendVerificationEmail(normalizedEmail, otp, type);

        if (!emailResult.success) {
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully',
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
