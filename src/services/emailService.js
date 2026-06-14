import "dotenv/config";
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})


export async function sendEmail({ to, subject, text, anexos = []}) {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        attachments: anexos
    });
}