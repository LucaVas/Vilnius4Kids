import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Playground } from '../playground/playground';
import { Report } from '../report/report';
import { ReportStatus } from '../report/ReportStatus';

@Entity('report_status_change_logs')
export class ReportStatusChangeLog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('enum', {
    enum: ReportStatus,
    default: ReportStatus.OPEN,
  })
  status: ReportStatus;

  @Column('varchar', { length: 255, nullable: false })
  changeStatusMessage: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  changedAt: Date;

  @ManyToOne(() => Report, report => report.changeLogs, { onDelete: 'CASCADE' })
  report: Report;

  @OneToMany(() => Playground, playground => playground.address, {
    onDelete: 'CASCADE',
  })
  playground: Playground;
}
