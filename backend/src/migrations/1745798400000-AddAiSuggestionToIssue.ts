import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAiSuggestionToIssue1745798400000 implements MigrationInterface {
  name = 'AddAiSuggestionToIssue1745798400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `issue` ADD `aiSuggestion` JSON NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `issue` DROP COLUMN `aiSuggestion`',
    );
  }
}
