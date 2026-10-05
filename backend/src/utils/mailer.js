import nodemailer from 'nodemailer';
import luminaEmail from '../EmailTemplates/luminaEmail.js';


const transporter = nodemailer.createTransport({

    host: process.env.SMTP_HOST,

    port: Number(process.env.SMTP_PORT || 587),

    secure: process.env.SMTP_SECURE === 'true',

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }

});


export const mail = async (
    to,
    subject,
    title,
    body,
    text,
    preheader = ''
) => {

    if (!process.env.SMTP_USER) {

        console.log('SMTP_USER is not configured');

        return;

    }


    try {

        const info = await transporter.sendMail({

            from: `"Lumina" <${process.env.SMTP_USER}>`,

            sender: process.env.SMTP_USER,

            replyTo: process.env.SMTP_USER,

            to,

            subject,

            text: text || `${title}\n\n${body}`,

            html: luminaEmail(
                title,
                body,
                preheader
            )

        });


        console.log(
            'Email sent successfully:',
            info.messageId
        );


        return info;

    } catch (error) {

        console.error(
            'Email sending failed:',
            error
        );

        throw error;

    }

};