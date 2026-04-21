export type Issue = {
  issueId?: string;
  author?: User;
  title: string;
  description: string;
  createdAt?: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  optionalFields?: { id?: string; name: string; value: string }[];
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
