import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  url: process.env.SMTP_URL,
});

export default class Mailer {
  static async send(to: string, subject: string, text: string) {
    await transporter.sendMail({
      from: "noreply@shortim.at",
      to,
      subject,
      text,
    });
  }
}
