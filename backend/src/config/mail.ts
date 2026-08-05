import nodemailer from "nodemailer"
import { env } from "./env.js"

export const transporter = nodemailer.createTransport({
    service: 'email',
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_APP_PASSWORD
    }
})