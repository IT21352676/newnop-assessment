import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DbMigrationService implements OnModuleInit {
  private readonly logger = new Logger(DbMigrationService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onModuleInit() {
    await this.ensureAiSuggestionColumn();
  }

  private async ensureAiSuggestionColumn() {
    const rows = await this.dataSource.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME = 'issue'
         AND COLUMN_NAME = 'aiSuggestion'`,
    );

    if (rows.length === 0) {
      await this.dataSource.query(
        'ALTER TABLE `issue` ADD `aiSuggestion` JSON NULL',
      );
      this.logger.log('Added aiSuggestion column to issue table');
    }
  }
}
