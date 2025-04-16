import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  isCorporateEmail(email: string): boolean {
    return email.endsWith('@empresa.com');
  }

  async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  }

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  validateNewUser(user: User): void {
    if (!this.isCorporateEmail(user.email)) {
      throw new Error('Solo se permiten correos corporativos');
    }

    if (user.name.length < 3) {
      throw new Error('El nombre es demasiado corto');
    }
  }

  calculateUserScore(user: User): number {
    let score = 100;

    if (!this.isCorporateEmail(user.email)) score -= 50;
    if (user.name.length < 5) score -= 25;

    return score;
  }
}
