import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserUseCase } from '../../application/create-user.use-case';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: { name: string; email: string; password: string }) {
    await this.createUserUseCase.execute(dto.name, dto.email, dto.password);
    return { message: 'User created' };
  }
}
