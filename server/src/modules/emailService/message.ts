
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
