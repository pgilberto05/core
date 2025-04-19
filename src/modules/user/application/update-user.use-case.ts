import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../domain/repositories/user.repository';
import { UserService } from '../domain/services/user.service';
import { User } from '../domain/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository,
    private readonly userService: UserService,
  ) {}

  async execute(id: number, user: UpdateUserDto) {
    const existing = await this.userRepo.findById(id);
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const hashedPassword = user.password
      ? await this.userService.hashPassword(user.password)
      : existing.password;

    const updatedUser = new User(id, user.name, user.email, hashedPassword);
    this.userService.validateNewUser(updatedUser);
    return this.userRepo.update(id, updatedUser);
  }
}
