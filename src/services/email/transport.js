import nodemailer from "nodemailer";
import { Resend } from "resend";

const isProd = process.env.NODE_ENV === "production";

const resend = isProd ? new Resend(process.env.RESEND_API_KEY) : null;

const smtpTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

export const sendMail = async (mail) => {
  if (isProd) {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      test: mail.text,
    });
    if (error) throw new Error(error.message);
    return data.id;
  }

  const info = await smtpTransporter().sendMail(mail);
  return info.messageId;
};
