import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.object';
import { IssuePriority, IssueSeverity, IssueStatus } from 'src/interfaces/types';

@Entity()
export class Issue {
  @PrimaryColumn({ length: 100 })
  issueId: string;

  @ManyToOne(() => User, (user) => user.issues, {
    onDelete: 'CASCADE',
  })
  author: User;

  @Column({ type: 'varchar', length:200})
  title: string;

  @Column({ type: 'varchar', length:500})
  description: string;

  @Column({ type: 'varchar'})
  createdAt: string;

  @Column({ type: 'varchar' })
  status: IssueStatus;

  @Column({ type: 'varchar'})
  priority: IssuePriority;

  @Column({ type: 'varchar'})
  severity: IssueSeverity;
}
