import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'MetaGen'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
        });

        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error };
    }
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getVerificationEmailHTML(otp: string, type: 'signup' | 'recovery' = 'signup'): string {
    const title = type === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
    const description = type === 'signup' 
        ? 'Welcome to MetaGen! Please verify your email address to complete your registration.'
        : 'You requested to reset your password. Use the code below to continue.';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
                <tr>
                    <td align="center">
                        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 40px 40px 30px; text-align: center;">
                                    <div style="width: 60px; height: 60px; background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6M22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6M22 6L12 13L2 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">${title}</h1>
                                </td>
                            </tr>
                            
                            <!-- Body -->
                            <tr>
                                <td style="padding: 40px;">
                                    <p style="margin: 0 0 24px; color: #6B7280; font-size: 16px; line-height: 24px;">
                                        ${description}
                                    </p>
                                    
                                    <div style="background-color: #F3F4F6; border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0;">
                                        <p style="margin: 0 0 16px; color: #6B7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                            Your Verification Code
                                        </p>
                                        <div style="font-size: 48px; font-weight: 700; color: #1F2937; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </div>
                                        <p style="margin: 16px 0 0; color: #9CA3AF; font-size: 13px;">
                                            This code expires in <strong>5 minutes</strong>
                                        </p>
                                    </div>
                                    
                                    <p style="margin: 0 0 16px; color: #6B7280; font-size: 14px; line-height: 20px;">
                                        If you didn't request this code, please ignore this email or contact support if you have concerns.
                                    </p>
                                    
                                    <div style="border-top: 1px solid #E5E7EB; margin-top: 32px; padding-top: 24px;">
                                        <p style="margin: 0; color: #9CA3AF; font-size: 12px; line-height: 18px;">
                                            This email was sent from MetaGen. For questions, contact us at support@metagen.com
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #F9FAFB; padding: 24px 40px; text-align: center; border-top: 1px solid #E5E7EB;">
                                    <p style="margin: 0 0 8px; color: #6B7280; font-size: 13px;">
                                        © ${new Date().getFullYear()} MetaGen. All rights reserved.
                                    </p>
                                    <p style="margin: 0; color: #9CA3AF; font-size: 12px;">
                                        AI-Powered Meta Ads Strategy Generator
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}

export async function sendVerificationEmail(email: string, otp: string, type: 'signup' | 'recovery' = 'signup') {
    const subject = type === 'signup' ? 'Verify Your Email - MetaGen' : 'Reset Your Password - MetaGen';
    const html = getVerificationEmailHTML(otp, type);
    
    return await sendEmail({
        to: email,
        subject,
        html,
    });
}
