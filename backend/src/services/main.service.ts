import { Injectable, Logger } from '@nestjs/common';
import {
  IssueDto,
  IssuePriority,
  IssueSeverity,
  IssueStatus,
} from 'src/interfaces/types';
import { IssueDatabaseService } from './database/issue.database.service';
import { UserDatabaseService } from './database/user.database.service';
import { ConfigService } from '@nestjs/config';
import { AIService } from './ai.service';

@Injectable()
export class MainService {
  private readonly logger = new Logger(MainService.name);
  constructor(
    private readonly issueDatabaseService: IssueDatabaseService,
    private readonly userDatabaseService: UserDatabaseService,
    private readonly configService: ConfigService,
    private readonly aiService: AIService,
  ) {}

  async getAllUsers() {
    return await this.userDatabaseService.findAllUsers();
  }

  issueAllStatus() {
    return Object.values(IssueStatus);
  }

  issueAllPriority() {
    return Object.values(IssuePriority);
  }

  issueAllSeverity() {
    return Object.values(IssueSeverity);
  }

  async createIssue(issue: IssueDto) {
    return await this.issueDatabaseService.saveIssue(issue);
  }

  async getAllIssues() {
    return await this.issueDatabaseService.findAll();
  }

  async getIssueById(issueId: string) {
    return await this.issueDatabaseService.findById(issueId);
  }

  async getAllIssuesByUserId(userId: string) {
    return await this.issueDatabaseService.findAllByUserId(userId);
  }

  async removeIssue(issueId: string) {
    return await this.issueDatabaseService.removeIssue(issueId);
  }

  async updateIssue(issue: IssueDto) {
    return await this.issueDatabaseService.updateIssue(issue);
  }

  async optionalFieldCount() {
    const defaultCount = 3;
    const optionalFieldCount = this.configService.get<number>(
      'OPTIONAL_FIELDS_COUNT',
    );
    if (!optionalFieldCount) {
      this.logger.warn(
        `Optional fields count not defined in .env file, using default count ${defaultCount}`,
      );
      return defaultCount;
    }
    return optionalFieldCount;
  }

  async addOptionalFields(
    issueId: string,
    optionalFields: { id: string; name: string; value: string }[],
  ) {
    return await this.issueDatabaseService.addOptionalField(
      issueId,
      optionalFields,
    );
  }

  async removeOptionalField(issueId: string, optionalFieldId: string) {
    return await this.issueDatabaseService.removeOptionalField(
      issueId,
      optionalFieldId,
    );
  }
  async getAiSuggestions(issueId: string) {
    const issue = await this.issueDatabaseService.findById(issueId);
    if (!issue) {
      throw new Error('Issue not found');
    }
    return await this.aiService.getAIResponse(issue);
  }
}
