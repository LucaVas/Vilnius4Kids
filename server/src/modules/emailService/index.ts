import config from '@server/config';
import transporter from './transporter';
import buildMessage from './message';

const { smtp, clientPath } = config;

export default (username: string, recipient: string) => ({
    sendReport: (reportId: number) => {
        const subject = `Vilnius4Kids - Report update for #${reportId}`;
        const html = `<header><p>Hi, ${username}</p></header><body><p>You are receiving this email because there is a new update on your report.<br><br>To know more about it, please check the section "My reports" in your <a href="${clientPath}">Vilnius4Kids profile</a>.</p></body><footer><p>Best regards,</p><p>Vilnius4Kids team</p></footer>`;

        const message = buildMessage(smtp.sender, recipient, subject, html);

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
            } else {
                console.log('Email sent: ', info.response);
            }
        });
    },
    sendToken: (token: string) => {
        const url = `${clientPath}/verify?email=${recipient}&token=${token}`;
        const subject = `Vilnius4Kids - Verify your account`;
        const html = `<header><p>Hi, ${username}</p></header><body><p>Thank you for signing up for Vilnius4Kids!.<br><br>To verify your account, please click <a href="${url}">here</a>.</p></body><footer><p>Best regards,</p><p>Vilnius4Kids team</p></footer>`;

        const message = buildMessage(smtp.sender, recipient, subject, html);

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
            } else {
                console.log('Email sent: ', info.response);
            }
        });
    },
});
