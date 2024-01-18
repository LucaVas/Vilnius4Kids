import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user';
import { Playground } from '../plaground/playground';
import { ReportStatusChangeLog } from '../report_status_change_log/reportStatusChangeLog';

export enum ReportStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in progress',
  CLOSED = 'closed',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('varchar', { length: 500, nullable: false })
  text: string;

  @Column('enum', {
    enum: ReportStatus,
    default: ReportStatus.OPEN,
  })
  status: ReportStatus;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.reports, {
    onDelete: 'SET NULL',
  })
  user: User;

  @OneToMany(() => ReportStatusChangeLog, log => log.reports, {
    onDelete: 'SET NULL',
  })
  changeLogs: ReportStatusChangeLog[];

  @ManyToMany(() => Playground, playground => playground.reports)
  @JoinTable()
  playgrounds: Playground[];
}
