import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): string {
    return 'Welcome to the NOP Assessment API';
  }

  testConnection(): string {
    return 'Connection success';
  }
}
