import { UserRepository } from '../domain/repositories/user.repository';
import { User } from '../domain/entities/user.entity';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../domain/services/user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository,
    private readonly userService: UserService,
  ) {}

  async execute(dto: CreateUserDto): Promise<void> {
    const hashedPassword = await this.userService.hashPassword(dto.password);

    const user = new User(null, dto.name, dto.email, hashedPassword);

    // Aquí se aplica la lógica de dominio pura
    this.userService.validateNewUser(user);

    return this.userRepo.save(user);
  }
}
