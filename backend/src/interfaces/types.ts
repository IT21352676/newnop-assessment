// export enum LoginStatus {
//   Success = 'SUCCESS',
//   Failed = 'FAILED',
// }

// export enum AccountStatus {
//   Online = 'ONLINE',
//   Offline = 'OFFLINE',
// }

export type IssueDto = {
  issueId: string;
  author: UserDto;
  title: string;
  description: string;
  createdAt: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
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
