import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user';
import { Playground } from '../playground/playground';
import { ReportStatusChangeLog } from '../report_status_change_log/reportStatusChangeLog';
import { ReportCategory } from '../report_category/reportCategory';
import { ReportImage } from '../report_images/reportImage';
import { ReportStatus } from './ReportStatus';

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 500, nullable: false })
    description: string;

    @Column('enum', {
        enum: ReportStatus,
        default: ReportStatus.OPEN,
    })
    status: ReportStatus;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => ReportCategory, (category) => category.reports, {
        cascade: true,
    })
    category: ReportCategory;

    @OneToMany(() => ReportImage, (images) => images.report, {
        eager: true,
    })
    images: ReportImage[];

    @ManyToOne(() => User, (user) => user.reports, {
        onDelete: 'CASCADE', // When a user is deleted, delete the report as well
    })
    user: User;

    @OneToMany(() => ReportStatusChangeLog, (log) => log.report)
    changeLogs: ReportStatusChangeLog[];

    @ManyToOne(() => Playground, (playground) => playground.reports, {
        onDelete: 'CASCADE', // When a playground is deleted, delete the report as well
    })
    playground: Playground;
}
