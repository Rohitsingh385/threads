import { env } from "../config/env.js";
import { transporter } from "../config/mail.js";

export const sendMail = async(to: string, subject: string, text: string)=> {

    await transporter.sendMail({
        from: env.EMAIL_USER,
        to,
        subject,
        text
    })
}