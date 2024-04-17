export type SubscriptionContent = { email: string };
export type ResetPasswordContent = { email: string };
export type ReportContent = { email: string };

export type ActionMessage = {
    command: 'registerSubscription' | 'resetPassword' | 'sendReport';
    content: SubscriptionContent | ResetPasswordContent | ReportContent;
    timestamp: Date;
};

export interface RabbitMqService {
    processCommand(msg: ActionMessage): Promise<void>;
}

export interface MailService {
    sendSubscriptionEmail(recipient: string): Promise<void>;
    sendPasswordResetToken(
        token: string,
        recipient: string,
        username: string
    ): Promise<void>;
    sendReport(
        reportId: number,
        recipient: string,
        username: string
    ): Promise<void>;
    sendToken(
        token: string,
        recipient: string,
        username: string
    ): Promise<void>;
}
