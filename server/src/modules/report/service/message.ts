import config from '@server/config';

const { smtp } = config;

export default (username: string, recipient: string, reportId: number) => ({
    from: smtp.sender,
    to: recipient,
    subject: `Vilnius4Kids - Report update for #${reportId}`,
    html: `<header><p>Hi, ${username}</p></header><body><p>You are receiving this email because there is a new update on your report.<br><br>To know more about it, please check the section "My reports" in your <a href="#">Vilnius4Kids profile</a>.</p></body><footer><p>Best regards,</p><p>Vilnius4Kids team</p></footer>`,
});
