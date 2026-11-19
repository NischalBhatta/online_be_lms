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
      text: mail.text,
    });
    if (error) throw new Error(error.message);
    return data.id;
  }

  //Dev: print the email in the terminal so OTPs/links are visible even for dummy addresses
  console.log(
    `\n📧 [DEV EMAIL] To: ${mail.to}\n   Subject: ${mail.subject}\n   ${mail.text}`,
  );

  const info = await smtpTransporter().sendMail(mail);

  //Ethereal only: link to view the captured email in the browser (false for other SMTP hosts)
  const previewUrl = nodemailer.getTestMessageUrl(info);
  previewUrl && console.log(`   Preview: ${previewUrl}\n`);

  return info.messageId;
};
