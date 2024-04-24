export type Message = {
    from: string;
    to: string;
    subject: string;
    html: string;
};

export default (
    sender: string,
    recipient: string,
    subject: string,
    html: string
) => ({
    from: sender,
    to: recipient,
    subject,
    html,
});
