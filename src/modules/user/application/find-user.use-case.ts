import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../domain/repositories/user.repository';
import { User } from '../domain/entities/user.entity';

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository,
  ) {}

  async execute(id: number): Promise<User | null> {
    return this.userRepo.findById(id);
  }
}
