/* eslint-disable @typescript-eslint/no-non-null-assertion */
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import nunjuks from "nunjucks";
import path from "path";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST!,
  port: parseInt(process.env.EMAIL_PORT!, 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASSWORD!,
  },
});

const njk = nunjuks.configure(path.resolve(__dirname, "..", "assets", "emails"), {
  autoescape: true,
});

export interface EmailOptions {
  to: Mail.Address[];
  subject: string;
  text: string;
  template?: string;
  context?: Record<string, any>;
}

export async function sendEmail({ to, subject, text, template, context }: EmailOptions) {
  let html: string | undefined;

  if (template) {
    html = njk.render(`${template}.html`, context);
  }

  try {
    await transporter.sendMail({
      from: {
        name: "My App",
        address: process.env.EMAIL_USER!,
      },
      to,
      subject,
      text,
      html,
    });
  } catch (e) {
    console.error(e);
  }
}
