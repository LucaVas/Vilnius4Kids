import nodemailer from 'nodemailer';
import config from '@server/config';

const { smtp } = config;

export default nodemailer.createTransport({
    service: smtp.service,
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
        user: smtp.auth.user,
        pass: smtp.auth.pass,
    },
});
