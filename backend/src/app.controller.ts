import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guard/jwt.guard';
import * as dataInterface from './interfaces/types';
import { AuthService } from './services/auth.service';
import { MainService } from './services/main.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly mainService: MainService,
  ) {}

  @Get('/test-connection')
  @UseGuards(JwtAuthGuard)
  testConnection(): string {
    return this.appService.testConnection();
  }

  @Post('/register')
  async register(
    @Body()
    data: {
      userId: string;
      accessKey: string;
    },
  ) {
    const user: dataInterface.UserDto = {
      userId: data.userId,
      accessKey: data.accessKey,
    };
    return await this.authService.registration(user);
  }

  @Post('/login')
  async login(
    @Body()
    data: {
      userId: string;
      accessKey: string;
    },
  ) {
    const user: dataInterface.UserDto = {
      userId: data.userId,
      accessKey: data.accessKey,
    };
    return await this.authService.validateLogin(user);
  }

  @Get('/verify-jwt-token')
  @UseGuards(JwtAuthGuard)
  async verifyJwtToken(@Headers('authorization') authHeader: string) {
    const token = authHeader?.replace('Bearer ', '');
    return this.authService.validateToken(token);
  }

  @Get('/get-all-users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Req() req: any) {
    return this.mainService.getAllUsers();
  }

  @Get('/issue-status')
  @UseGuards(JwtAuthGuard)
  async getAllIssueStatus(@Req() req: any) {
    return this.mainService.issueAllStatus();
  }

  @Get('/issue-priority')
  @UseGuards(JwtAuthGuard)
  async getAllIssuePriority(@Req() req: any) {
    return this.mainService.issueAllPriority();
  }

  @Get('/issue-severity')
  @UseGuards(JwtAuthGuard)
  async getAllIssueSeverity(@Req() req: any) {
    return this.mainService.issueAllSeverity();
  }

  @Post('/create-issue')
  @UseGuards(JwtAuthGuard)
  async createIssue(
    @Body()
    data: {
      title: string;
      description: string;
      status: dataInterface.IssueStatus;
      priority: dataInterface.IssuePriority;
      severity: dataInterface.IssueSeverity;
    },
    @Req() req: any,
  ) {
    const userId = req.user.sub as string;
    const issue: dataInterface.IssueDto = {
      issueId: Math.random().toString(36).substring(2, 15),
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      severity: data.severity,
      createdAt: new Date().toISOString(),
      author: { userId: userId },
    };
    return await this.mainService.createIssue(issue);
  }

  @Get('/get-all-issues')
  @UseGuards(JwtAuthGuard)
  async getAllIssues(@Req() req: any) {
    return await this.mainService.getAllIssues();
  }

  @Get('/get-issue-by-id')
  @UseGuards(JwtAuthGuard)
  async getIssueById(@Query('issueId') issueId: string, @Req() req: any) {
    return await this.mainService.getIssueById(issueId);
  }

  @Delete('/remove-issue')
  @UseGuards(JwtAuthGuard)
  async removeIssue(@Query('issueId') issueId: string, @Req() req: any) {
    return await this.mainService.removeIssue(issueId);
  }

  @Put('/update-issue')
  @UseGuards(JwtAuthGuard)
  async updateIssue(
    @Body()
    issue: dataInterface.IssueDto,
    @Req() req: any,
  ) {
    return await this.mainService.updateIssue(issue);
  }

  @Get('/optional-field-count')
  @UseGuards(JwtAuthGuard)
  async optionalFieldCount(@Req() req: any) {
    return await this.mainService.optionalFieldCount();
  }

  @Post('/add-optional-field')
  @UseGuards(JwtAuthGuard)
  async addOptionalField(
    @Body()
    data: {
      issueId: string;
      optionalField: { name: string; value: string }[];
    },
    @Req() req: any,
  ) {
    const optionalFields = data?.optionalField?.map((field) => {
      return {
        id: Math.random().toString(36).substring(2, 15),
        name: field.name,
        value: field.value,
      };
    });
    return await this.mainService.addOptionalFields(
      data.issueId,
      optionalFields,
    );
  }

  @Delete('/remove-optional-field')
  @UseGuards(JwtAuthGuard)
  async removeOptionalField(
    @Query('issueId') issueId: string,
    @Query('optionalFieldId') optionalFieldId: string,
    @Req() req: any,
  ) {
    return await this.mainService.removeOptionalField(issueId, optionalFieldId);
  }

  @Get('/ai-response')
  async getAIResponse(@Query('issueId') issueId: string, @Req() req: any) {
    return await this.mainService.getAiSuggestions(issueId);
  }
}
