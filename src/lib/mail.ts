import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD?.replace(/"/g, ''), // Remove quotes if present
  },
});

export const sendOTP = async (email: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"My E-commerce" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Таны баталгаажуулах код',
      text: `Таны баталгаажуулах код: ${otp}. Энэ код нь 5 минутын турш хүчинтэй.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">И-мэйл баталгаажуулалт</h2>
          <p>Таны баталгаажуулах код:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0;">
            ${otp}
          </div>
          <p>Энэ код нь 5 минутын турш хүчинтэй.</p>
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            Хэрэв та энэ хүсэлтийг илгээгээгүй бол энэ имэйлийг үл тооно уу.
          </p>
        </div>
      `,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
