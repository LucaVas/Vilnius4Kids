import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from '..';

@Entity('report_categories')
export class ReportCategory {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 50, nullable: false })
    name: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToOne(() => Report, (report) => report.category, {
        onDelete: 'SET NULL',
    })
    report: Report;
}
