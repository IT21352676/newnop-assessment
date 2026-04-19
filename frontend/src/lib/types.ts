export type Issue = {
  issueId?: string;
  author?: User;
  title: string;
  description: string;
  createdAt?: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
};

export type User = {
  userId: string;
  accessKey?: string;
  issues?: Issue[];
};

export enum IssueStatus {
  Open = "OPEN",
  InProgress = "IN_PROGRESS",
  InReview = "IN_REVIEW",
  Resolved = "RESOLVED",
  Closed = "CLOSED",
  Reopened = "REOPENED",
  Blocked = "BLOCKED",
}

export enum IssuePriority {
  Low = "LOW",
  Medium = "MEDIUM",
  High = "HIGH",
  Critical = "CRITICAL",
}

export enum IssueSeverity {
  Blocker = "BLOCKER",
  Critical = "CRITICAL",
  Major = "MAJOR",
  Minor = "MINOR",
}
