import { Injectable, Inject } from '@nestjs/common';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserService } from '../domain/services/user.service';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository,
    private readonly userService: UserService,
  ) {}

  async execute(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
