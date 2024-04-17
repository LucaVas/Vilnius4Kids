import { Playground, Report, ReportCategory, User } from '@server/entities';
import { ReportStatus } from '@server/entities/report/ReportStatus';

export type SubscriptionContent = { email: string };
export type ResetPasswordContent = { email: string };
export type ReportContent = {
    description: string;
    playground: Playground;
    category: ReportCategory;
    user: User;
};
export type UpdateReportContent = {
    description: string;
    status: ReportStatus;
    report: Report;
    user: User;
};

export type ActionMessage = {
    command:
        | 'registerSubscription'
        | 'resetPassword'
        | 'registerReport'
        | 'updateReport';
    content:
        | SubscriptionContent
        | ResetPasswordContent
        | ReportContent
        | UpdateReportContent;
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
