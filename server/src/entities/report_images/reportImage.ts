import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from '../report/report';

@Entity('report_images')
export class ReportImage {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 500, nullable: false })
    name: string;

    @Column('varchar', { length: 50, nullable: false })
    type: string;

    @Column('varchar', { length: 500, nullable: false, unique: true })
    url: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @ManyToOne(() => Report, (report) => report.images, {
        onDelete: 'CASCADE', // When a report is deleted, delete the image as well
    })
    report: Report;
}
