import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
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

export async function sendEmail(options: EmailOptions) {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@restaurant-pos.com',
      ...options,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: (error as Error).message };
  }
}

export async function sendVerificationEmail(
  email: string,
  verificationLink: string
) {
  const html = `
    <h2>Verify your email</h2>
    <p>Click the link below to verify your email address:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link expires in 24 hours.</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify your email address',
    html,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  resetLink: string
) {
  const html = `
    <h2>Reset your password</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link expires in 1 hour.</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your password',
    html,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <h2>Welcome to Restaurant POS System!</h2>
    <p>Hello ${name},</p>
    <p>Thank you for creating an account. You can now manage your restaurant operations efficiently.</p>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Restaurant POS System',
    html,
  });
}
