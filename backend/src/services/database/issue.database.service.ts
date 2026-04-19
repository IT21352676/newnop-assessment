import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from 'src/objects/issue.object';
import { Repository } from 'typeorm';
import { UserDatabaseService } from './user.database.service';
import { IssueDto } from 'src/interfaces/types';

@Injectable()
export class IssueDatabaseService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    private readonly userDatabaseService: UserDatabaseService,
  ) {}

  async saveIssue(issue: IssueDto): Promise<Issue> {
    if (!issue.author.userId) {
      throw new BadRequestException('User ID not found');
    }
    const user = await this.userDatabaseService.findUserByUserId(
      issue.author.userId,
    );
    if (!user) {
      throw new Error('User not found');
    }

    const newIssue: Issue = {
      issueId: issue.issueId,
      author: user,
      title: issue.title,
      description: issue.description,
      createdAt: issue.createdAt,
      status: issue.status,
      priority: issue.priority,
      severity: issue.severity,
    };
    return this.issueRepository.save(newIssue);
  }

  async findAll(): Promise<Issue[]> {
    return this.issueRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllByUserId(userId: string): Promise<Issue[]> {
    return this.issueRepository.find({
      where: { author: { userId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(issueId: string): Promise<Issue | null> {
    return this.issueRepository.findOne({
      where: { issueId },
      relations: ['author'],
    });
  }

  async removeIssue(issueId: string): Promise<void> {
    await this.issueRepository.delete(issueId);
  }

  async updateIssue(issue: IssueDto): Promise<Issue> {
    const existingIssue = await this.findById(issue.issueId);
    if (!existingIssue) {
      throw new Error('Issue not found');
    }

    const user = await this.userDatabaseService.findUserByUserId(
      issue.author.userId,
    );
    if (!user) {
      throw new Error('User not found');
    }

    const updatedIssue: Issue = {
      ...existingIssue,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      priority: issue.priority,
      severity: issue.severity,
      author: user,
    };

    return this.issueRepository.save(updatedIssue);
  }
}
