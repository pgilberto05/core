import { UserRepository } from '../domain/repositories/user.repository';
import { User } from '../domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../domain/services/user.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository,
    private readonly userService: UserService,
  ) {}

  async execute(name: string, email: string, password: string): Promise<void> {
    const hashedPassword = await this.userService.hashPassword(password);

    const user = new User(null, name, email, hashedPassword);

    // Aquí se aplica la lógica de dominio pura
    this.userService.validateNewUser(user);

    await this.userRepo.save(user);
  }
}
