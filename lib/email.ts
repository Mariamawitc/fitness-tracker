import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

  try {
    await resend.emails.send({
      from: 'Fitness Tracker <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your email address',
      html: `
        <h2>Welcome to Fitness Tracker!</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you didn't create this account, you can safely ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: 'Fitness Tracker <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your password',
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
}
