import { Playground, Report, ReportCategory, User } from '@server/entities';
import { ReportStatus } from '@server/entities/report/ReportStatus';

export type SubscriptionContent = { email: string };
export type PasswordResetContent = { user: User };
export type AccountVerificationContent = { user: User };
export type ReportContent = {
    description: string;
    playground: Playground;
    category: ReportCategory;
    user: User;
    images: {
        url: string;
        type: string;
        name: string;
    }[];
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
        | 'updateReport'
        | 'verifyAccount';
    content:
        | SubscriptionContent
        | PasswordResetContent
        | ReportContent
        | UpdateReportContent
        | AccountVerificationContent;
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
    sendVerificationToken(
        token: string,
        recipient: string,
        username: string
    ): Promise<void>;
}
