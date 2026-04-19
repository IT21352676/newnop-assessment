import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/objects/user.object';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/interfaces/types';

@Injectable()
export class UserDatabaseService {
  constructor(
    @InjectRepository(User)
    private readonly userDataRepository: Repository<User>,
  ) {}

  async createUser(user: UserDto) {
    if (!user.accessKey) {
      throw new HttpException(
        'User identity or accessKey is missing',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const existingUser = await this.userDataRepository.findOne({
      where: { userId: user.userId },
    });

    if (existingUser) {
      throw new BadRequestException('User identity already exists');
    }

    const hashedPassword = await bcrypt.hash(user.accessKey, 10);

    try {
      await this.userDataRepository.save({
        ...user,
        accessKey: hashedPassword,
      });
      return new HttpException('User registration success', HttpStatus.OK);
    } catch {
      return new HttpException(
        'User registration failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findUserByUserId(userId: string): Promise<User | null> {
    return this.userDataRepository.findOne({ where: { userId } });
  }

  async findAllUsers(): Promise<User[] | null> {
    return this.userDataRepository.find();
  }
}
