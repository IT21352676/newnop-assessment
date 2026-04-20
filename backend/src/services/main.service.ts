import { Injectable } from '@nestjs/common';
import {
  IssueDto,
  IssuePriority,
  IssueSeverity,
  IssueStatus,
} from 'src/interfaces/types';
import { IssueDatabaseService } from './database/issue.database.service';
import { UserDatabaseService } from './database/user.database.service';

@Injectable()
export class MainService {
  constructor(
    private readonly issueDatabaseService: IssueDatabaseService,
    private readonly userDatabaseService: UserDatabaseService,
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
}
