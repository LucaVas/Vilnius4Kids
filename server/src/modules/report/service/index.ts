import transporter from './transporter';
import buildMessage from './message';

export default (username: string, recipient: string, reportId: number) => ({
    send: () => {
        const message = buildMessage(username, recipient, reportId);

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.error('Error sending email: ', error);
            } else {
                console.log('Email sent: ', info.response);
            }
        });
    },
});
