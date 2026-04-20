import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketGateway } from './gateways/ws.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserDatabaseService } from './services/database/user.database.service';
import { IssueDatabaseService } from './services/database/issue.database.service';
import { User } from './objects/user.object';
import { Issue } from './objects/issue.object';
import { AuthService } from './services/auth.service';
import { MainService } from './services/main.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // disable in production
      }),
    }),
    TypeOrmModule.forFeature([User, Issue]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SocketGateway,
    UserDatabaseService,
    IssueDatabaseService,
    AuthService,
    MainService,
  ],
})
export class AppModule {}
