import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { CreateUserUseCase } from './application/create-user.use-case';
import { UserService } from './domain/services/user.service';
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserUseCase } from './application/update-user.use-case';
import { DeleteUserUseCase } from './application/delete-user.use-case';
import { FindUserUseCase } from './application/find-user.use-case';
import { ListUserUseCase } from './application/list-users.use-case';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    FindUserUseCase,
    ListUserUseCase,
    UserService,
    PrismaService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
