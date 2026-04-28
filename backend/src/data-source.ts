import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Issue } from './objects/issue.object';
import { User } from './objects/user.object';
import { AddAiSuggestionToIssue1745798400000 } from './migrations/1745798400000-AddAiSuggestionToIssue';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Issue],
  migrations: [AddAiSuggestionToIssue1745798400000],
  synchronize: false,
});
