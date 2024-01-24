import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from '..';

@Entity('report_categories')
export class ReportCategory {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('varchar', { length: 50, nullable: false })
    topic: string;

    @Column('varchar', { length: 50, nullable: false })
    name: string;

    @Column('varchar', { length: 500, nullable: false })
    description: string;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @OneToMany(() => Report, (report) => report.category, {
        onDelete: 'SET NULL',
    })
    reports: Report[];
}
