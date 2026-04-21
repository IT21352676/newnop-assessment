import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from '../interfaces/types';
import { UserDatabaseService } from './database/user.database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly userDatabaseService: UserDatabaseService,
  ) {}

  async validateLogin(user: UserDto) {
    if (!user.userId || !user.accessKey) {
      throw new HttpException(
        'User identity or accessKey is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const findUser = await this.userDatabaseService.findUserByUserId(
      user.userId,
    );

    if (!findUser) {
      throw new HttpException(
        'User identity not exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isPasswordMatching = await bcrypt.compare(
      user.accessKey,
      findUser.accessKey,
    );

    if (!isPasswordMatching) {
      throw new HttpException('Invalid access key', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.jwt.signAsync(
      {
        sub: findUser.userId,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      },
    );

    return {
      message: 'Login successful',
      accessToken: token,
    };
  }

  async validateToken(token: string): Promise<{ sub: string } | undefined> {
    if (!token) {
      throw new HttpException('Token is missing', HttpStatus.UNAUTHORIZED);
    }
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      return;
    }
    try {
      const response: {
        sub: string;
        iat: number;
        exp: number;
      } = this.jwt.verify(token, { secret: secret });
      return { sub: response.sub };
    } catch (err) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  async registration(user: UserDto) {
    return await this.userDatabaseService.createUser(user);
  }
}
