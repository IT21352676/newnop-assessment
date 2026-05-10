import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DbMigrationService implements OnModuleInit {
  private readonly logger = new Logger(DbMigrationService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit() {
    this.logger.log('DbMigrationService: running schema check');
    await this.ensureAiSuggestionColumn();
  }

  private async ensureAiSuggestionColumn() {
    try {
      await this.dataSource.query(
        'ALTER TABLE `issue` ADD `aiSuggestion` JSON NULL',
      );
      this.logger.log('DbMigrationService: added aiSuggestion column');
    } catch (error: any) {
      // errno 1060 = "Duplicate column name" — column already exists, nothing to do
      if (error?.errno === 1060) {
        this.logger.log('DbMigrationService: aiSuggestion column already exists');
        return;
      }
      this.logger.error('DbMigrationService: failed to add aiSuggestion column', error?.message);
      throw error;
    }
  }
}
