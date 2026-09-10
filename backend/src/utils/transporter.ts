import { env } from "../config/env.js";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY)

export const sendMail = async(to: string, subject: string, text: string)=> {

    const {error} = await resend.emails.send({
        from : "Threads <noreply@rowhit.in>",
        to,
        subject,
        text
    })
    if(error){
        throw new Error(error.message)
    }
}