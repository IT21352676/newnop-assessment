export type IssueDto = {
  issueId: string;
  author: UserDto;
  title: string;
  description: string;
  createdAt: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  optionalFields?: { id: string; name: string; value: string }[];
};

export type UserDto = {
  userId: string;
  accessKey?: string;
  issues?: IssueDto[];
};

export enum IssueStatus {
  Open = 'OPEN',
  InProgress = 'IN_PROGRESS',
  InReview = 'IN_REVIEW',
  Resolved = 'RESOLVED',
  Closed = 'CLOSED',
  Reopened = 'REOPENED',
  Blocked = 'BLOCKED',
}

export enum IssuePriority {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
  Critical = 'CRITICAL',
}

export enum IssueSeverity {
  Blocker = 'BLOCKER',
  Critical = 'CRITICAL',
  Major = 'MAJOR',
  Minor = 'MINOR',
}
