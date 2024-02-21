import config from '@server/config';
import logger from '@server/logger';
import transporter from './transporter';
import buildMessage, { Message } from './message';

const { smtp, clientPath, env } = config;

async function send(message: Message) {
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

export default (username: string | null, recipient: string) => ({
    sendReport: async (reportId: number) => {
        const subject = `Vilnius4Kids - Report update for #${reportId}`;
        const html = `<header><p>Hi, ${username}</p></header><body><p>You are receiving this email because there is a new update on your report.<br><br>To know more about it, please check the section "My reports" in your <a href="${clientPath}">Vilnius4Kids profile</a>.</p></body><footer><p>Best regards,</p><p>Vilnius4Kids team</p></footer>`;

        const message = buildMessage(smtp.sender, recipient, subject, html);

        if (env !== 'test') {
            send(message);
        }
    },
    sendToken: async (token: string) => {
        const url = `${clientPath}/verify?email=${recipient}&token=${token}`;
        const subject = `Vilnius4Kids - Verify your account`;
        const html = `<header><p>Hi, ${username}</p></header><body><p>Thank you for signing up for Vilnius4Kids!.<br><br>To verify your account, please click <a href="${url}">here</a>.</p></body><footer><p>Best regards,</p><p>Vilnius4Kids team</p></footer>`;

        const message = buildMessage(smtp.sender, recipient, subject, html);

        if (env !== 'test') {
            send(message);
        }
    },
    sendSubscriptionEmail: async () => {
        const subject = `Vilnius4Kids - Thank you for subscribing!`;
        const html = `<header><p>Hi!</p></header><body><p>Thank you so much for subscribing to <a href="${clientPath}">Vilnius4Kids</a>!.<br><br>Vilnius4Kids is a platform built to help families find playgrounds around Vilnius. If you have children, this is the right place for you. Our main goal is to simplify your life, so if you have any suggestions, reach out to our team at vilniusforkids@gmail.com.</p><br><p>You can use our demo version without an account, but for a full experience, we invite you to create one <a href="${clientPath}/signup">here</a>. With an account, you can save playgrounds among favorites, report issues, help us grow and improve our service, and much more!</p><br><br><p>Thank you again.</p></body><footer><p>Best regards,</p><p>Vilnius4Kids team</p></footer>`;

        const message = buildMessage(smtp.sender, recipient, subject, html);

        if (env !== 'test') {
            send(message);
        }
    },
});
