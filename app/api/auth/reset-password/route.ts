import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        const supabase = createAdminClient();

        // Verify that the reset request is verified
        const { data: resetRequest, error } = await supabase
            .from('pending_password_resets')
            .select('*')
            .eq('email', email)
            .eq('verified', true)
            .single();

        if (error || !resetRequest) {
            return NextResponse.json(
                { error: 'Invalid reset request. Please verify OTP first.' },
                { status: 400 }
            );
        }

        // Check if verification is still valid (within 10 minutes)
        const verificationAge = Date.now() - new Date(resetRequest.updated_at || resetRequest.created_at).getTime();
        if (verificationAge > 10 * 60 * 1000) {
            return NextResponse.json(
                { error: 'Reset verification expired. Please request a new code.' },
                { status: 400 }
            );
        }

        // Get user by email and update password
        const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
        
        if (getUserError) {
            return NextResponse.json(
                { error: 'Failed to find user' },
                { status: 500 }
            );
        }

        const user = users?.find(u => u.email === email);
        
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update password using admin API
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.id,
            { password }
        );

        if (updateError) {
            return NextResponse.json(
                { error: updateError.message },
                { status: 400 }
            );
        }

        // Delete the reset request
        await supabase
            .from('pending_password_resets')
            .delete()
            .eq('email', email);

        return NextResponse.json({
            success: true,
            message: 'Password reset successfully',
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
