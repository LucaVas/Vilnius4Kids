import config from '@server/config';
import logger from '@server/logger';
import transporter from './transporter';
import buildMessage from './message';

const { smtp, clientPath, env } = config;

export default (username: string, recipient: string) => ({
    sendReport: async (reportId: number) => {
        const subject = `Vilnius4Kids - Report update for #${reportId}`;
        const html = `<header><p>Hi, ${username}</p></header><body><p>You are receiving this email because there is a new update on your report.<br><br>To know more about it, please check the section "My reports" in your <a href="${clientPath}">Vilnius4Kids profile</a>.</p></body><footer><p>Best regards,</p><p>Vilnius4Kids team</p></footer>`;

        const message = buildMessage(smtp.sender, recipient, subject, html);

        if (env !== 'test') {
            const info = await transporter.sendMail(message);
            if (info.rejected.length !== 0) {
                logger.error('Error while sending email: ', info.response);
                throw new Error('Error while sending email.');
            }
            if (info.accepted) {
                logger.info('Email sent successfully: ');
                logger.info(info);
            }
        }
    },
    sendToken: async (token: string) => {
        const url = `${clientPath}/verify?email=${recipient}&token=${token}`;
        const subject = `Vilnius4Kids - Verify your account`;
        const html = `<header><p>Hi, ${username}</p></header><body><p>Thank you for signing up for Vilnius4Kids!.<br><br>To verify your account, please click <a href="${url}">here</a>.</p></body><footer><p>Best regards,</p><p>Vilnius4Kids team</p></footer>`;

        const message = buildMessage(smtp.sender, recipient, subject, html);

        if (env !== 'test') {
            const info = await transporter.sendMail(message);
            if (info.rejected.length !== 0) {
                logger.error('Error while sending email: ', info.response);
                throw new Error('Error while sending email.');
            }
            if (info.accepted) {
                logger.info('Email sent successfully: ');
                logger.info(info);
            }
        }
    },
});
