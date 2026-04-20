import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Patch,
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
    return await this.mainService.getAllIssuesByUserId(issueId);
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

  // @Post('/save-feed')
  // @UseGuards(JwtAuthGuard)
  // async saveFeed(
  //   @Body()
  //   data: {
  //     link: dataInterface.BHWRSSFeedInterface['link'];
  //   },
  //   @Req() req: any,
  // ) {
  //   const userId = req.user.sub;
  //   return await this.feedDataBaseService.saveFeed(data.link, userId);
  // }

  // @Get('/get-all-feeds')
  // @UseGuards(JwtAuthGuard)
  // async getAllFeeds(@Req() req: any) {
  //   const userId = req.user.sub;
  //   return await this.feedDataBaseService.findAllForUser(userId);
  // }

  // @Delete('/remove-feed')
  // @UseGuards(JwtAuthGuard)
  // async removeFeed(
  //   @Body()
  //   data: {
  //     link: dataInterface.BHWRSSFeedInterface['link'];
  //   },
  //   @Req() req: any,
  // ) {
  //   const userId = req.user.sub;
  //   return await this.feedDataBaseService.removeFeed(data.link, userId);
  // }

  // @Post('/run-bhw-scraper')
  // @UseGuards(JwtAuthGuard)
  // async runBhwScraper(
  //   @Body()
  //   data: {
  //     link: dataInterface.BHWRSSFeedInterface['link'];
  //   },
  //   @Req() req: any,
  // ) {
  //   const userId = req.user.sub;
  //   return await this.bhwService.runScrapeForFeed(data.link, userId);
  // }

  // @Post('/stop-bhw-scraper')
  // @UseGuards(JwtAuthGuard)
  // async stopBhwScraper() {
  //   return await this.bhwService.stopScraping();
  // }

  // @Post('/save-bhw-keyword')
  // @UseGuards(JwtAuthGuard)
  // async saveBhwKeyword(@Body() data: { keyword: string }, @Req() req: any) {
  //   const userId = req.user.sub;
  //   return await this.bhwKeywordDataBaseService.saveKeyWord(data, userId);
  // }

  // @Get('/get-all-bhw-keywords')
  // @UseGuards(JwtAuthGuard)
  // async getAllBhwKeywords(@Req() req: any) {
  //   const userId = req.user.sub;
  //   return await this.bhwKeywordDataBaseService.findAllForUser(userId);
  // }

  // @Get('/get-bhw-scraping-status')
  // @UseGuards(JwtAuthGuard)
  // async getBhwScrapingStatus() {
  //   return this.bhwService.getScrapingStatus();
  // }

  // @Delete('/remove-bhw-keyword/:keyword')
  // @UseGuards(JwtAuthGuard)
  // async removeBhwKeyword(@Param('keyword') keyword: string, @Req() req: any) {
  //   const userId = req.user.sub;
  //   return await this.bhwKeywordDataBaseService.removeKeyWord(keyword, userId);
  // }

  // @Post('/get-all-bhw-threads')
  // async getAllKewordMatches(
  //   @Body()
  //   data: {
  //     username: string;
  //     password: string;
  //   },
  //   @Query('query') query?: string,
  //   @Query('platform') platform?: dataInterface.Platforms,
  //   @Query('startDate') startDate?: string,
  //   @Query('endDate') endDate?: string,
  // ) {
  //   const loginResponse = await this.authService.validateLogin(
  //     data?.username,
  //     data?.password,
  //   );
  //   if (loginResponse) {
  //     const isValid = await this.authService.validateToken(
  //       loginResponse.accessToken,
  //     );
  //     if (isValid && isValid.sub) {
  //       return await this.apiService.getBHWandDiscordAllMentions(
  //         isValid.sub,
  //         {
  //           query,
  //           platform,
  //           startDate,
  //           endDate,
  //         },
  //       );
  //     }
  //     throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  //   }
  //   throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  // }

  // @Post('/verify-reddit-feed')
  // @UseGuards(JwtAuthGuard)
  // async verifyRedditFeed(
  //   @Body() data: { rssUrl: dataInterface.RedditRSSFeedInterface['rssUrl'] },
  // ) {
  //   return await this.redditService.verifyFeed(data.rssUrl);
  // }

  // @Post('/run-reddit-scraper')
  // @UseGuards(JwtAuthGuard)
  // async runRedditScraper() {
  //   return await this.redditService.runRedditScraping();
  // }

  // @Post('/save-reddit-keyword')
  // @UseGuards(JwtAuthGuard)
  // async saveRedditKeyword(@Body() data: { keyword: string; subreddit: string }, @Req() req: any) {
  //   const userId = req.user.sub;
  //   return await this.redditKeywordDataBaseService.saveKeyWord(data, userId);
  // }

  // @Get('/get-all-reddit-keywords')
  // @UseGuards(JwtAuthGuard)
  // async getAllRedditKeywords(@Req() req: any) {
  //   const userId = req.user.sub;
  //   return await this.redditKeywordDataBaseService.findAllForUser(userId);
  // }

  // @Get('/get-reddit-last-run-time')
  // @UseGuards(JwtAuthGuard)
  // async getRedditLastRunTime() {
  //   return this.redditService.getLastRunTime();
  // }

  // @Delete('/remove-reddit-keyword')
  // @UseGuards(JwtAuthGuard)
  // async removeRedditKeyword(
  //   @Body() data: { keyword: string; subreddit: string },
  //   @Req() req: any,
  // ) {
  //   const userId = req.user.sub;
  //   return await this.redditKeywordDataBaseService.removeKeyWord(
  //     data.keyword,
  //     data.subreddit,
  //     userId,
  //   );
  // }

  // @Get('/get-all-reddit-entries')
  // @UseGuards(JwtAuthGuard)
  // async getAllRedditEntries(@Req() req: any) {
  //   const userId = req.user.sub;
  //   return await this.redditEntryDataBaseService.findAllForUser(userId);
  // }

  // @Get('/user/me')
  // @UseGuards(JwtAuthGuard)
  // async getMe(@Req() req: any) {
  //   const userId = req.user.sub;
  //   const user = await ((this.accountDataBaseService as any).userDatabaseService).findById(userId);
  //   if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   const { password, ...result } = user;
  //   return result;
  // }

  // @Patch('/user/settings')
  // @UseGuards(JwtAuthGuard)
  // async updateSettings(
  //   @Req() req: any,
  //   @Body() data: { googleSheetId?: string; slackChannelId?: string },
  // ) {
  //   const userId = req.user.sub;
  //   return await ((this.accountDataBaseService as any).userDatabaseService).updateSettings(userId, data);
  // }
}
