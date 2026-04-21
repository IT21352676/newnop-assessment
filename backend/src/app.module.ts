import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Issue } from './objects/issue.object';
import { User } from './objects/user.object';
import { AuthService } from './services/auth.service';
import { IssueDatabaseService } from './services/database/issue.database.service';
import { UserDatabaseService } from './services/database/user.database.service';
import { MainService } from './services/main.service';
import { AIService } from './services/ai.service';
import { MainController } from './main.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET not defined in .env file');
        }
        return {
          secret,
          signOptions: { expiresIn: '7d' },
        };
      },
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbHost = configService.get<string>('DB_HOST');
        const dbPort = configService.get<number>('DB_PORT');
        const dbUsername = configService.get<string>('DB_USERNAME');
        const dbPassword = configService.get<string>('DB_PASSWORD');
        const dbName = configService.get<string>('DB_NAME');
        if (!dbHost || !dbPort || !dbUsername || !dbName) {
          throw new Error('Database configuration not defined in .env file');
        }
        return {
          type: 'mysql',
          host: dbHost,
          port: dbPort,
          username: dbUsername,
          password: dbPassword,
          database: dbName,
          autoLoadEntities: true,
          synchronize: true, // disable in production
        };
      },
    }),
    TypeOrmModule.forFeature([User, Issue]),
  ],
  controllers: [AppController, MainController],
  providers: [
    AppService,
    UserDatabaseService,
    IssueDatabaseService,
    AuthService,
    MainService,
    AIService,
  ],
})
export class AppModule {}
