import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from './user.object';
import { IssuePriority, IssueSeverity, IssueStatus } from '../interfaces/types';

@Entity()
export class Issue {
  @PrimaryColumn({ length: 100 })
  issueId: string;

  @ManyToOne(() => User, (user) => user.issues, {
    onDelete: 'CASCADE',
  })
  author: User;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ type: 'varchar' })
  createdAt: string;

  @Column({ type: 'varchar' })
  status: IssueStatus;

  @Column({ type: 'varchar' })
  priority: IssuePriority;

  @Column({ type: 'varchar' })
  severity: IssueSeverity;

  @Column({ type: 'json', nullable: true })
  optionalFields?: { id: string; name: string; value: string }[];

  @Column({ type: 'json', nullable: true })
  aiSuggestion?: {
    classification: {
      type: string;
      component: string;
    };
    prioritySeverity: {
      currentPriority: string;
      suggestedPriority: string;
      currentSeverity: string;
      suggestedSeverity: string;
      rationale: string;
    };
    isUnclear: true | false;
    missingInfo: string[];
    rootCauses: { area: string; cause: string }[];
    suggestedFixes: string[];
    debuggingSteps: { step: number; action: string }[];
    jiraComment: string;
  };
}
