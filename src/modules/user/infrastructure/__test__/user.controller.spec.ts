import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { CreateUserUseCase } from '../../application/create-user.use-case';
import { UpdateUserUseCase } from '../../application/update-user.use-case';
import { DeleteUserUseCase } from '../../application/delete-user.use-case';
import { FindUserUseCase } from '../../application/find-user.use-case';
import { ListUserUseCase } from '../../application/list-users.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UpdateUserDto } from '../../application/dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: CreateUserUseCase;
  let listUserUseCase: ListUserUseCase;
  let findUserUseCase: FindUserUseCase;
  let updateUserUseCase: UpdateUserUseCase;

  const userRepo: UserRepository = {
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: DeleteUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ListUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    listUserUseCase = module.get<ListUserUseCase>(ListUserUseCase);
    findUserUseCase = module.get<FindUserUseCase>(FindUserUseCase);
  });

  it('should call createUserUseCase.execute with correct arguments', async () => {
    const dto = { name: 'Juan', email: 'juan@empresa.com', password: '1234' };
    await controller.create(dto);
    expect(createUserUseCase.execute).toHaveBeenCalledWith(dto);
  });

  it('should return a success message', async () => {
    const dto = { name: 'Ana', email: 'ana@empresa.com', password: 'abcd' };
    const response = await controller.create(dto);
    expect(response).toEqual({ message: 'User created' });
  });

  it('should return a success message when a user is deleted', async () => {
    const userId = 1;
    jest.spyOn(userRepo, 'delete').mockResolvedValue(undefined);
    const response = await controller.delete(userId);
    expect(response).toEqual({ message: 'User deleted' });
  });

  it('should return all users', async () => {
    const users = [{ id: 1, name: 'Ana', email: 'ana@empresa.com' }];
    jest.spyOn(listUserUseCase, 'execute').mockResolvedValue(users);
    expect(await controller.list()).toStrictEqual({ message: 'User created' });
  });

  it('should return a single user', async () => {
    const user = { id: 1, name: 'Ana', email: 'ana@empresa.com' };
    jest.spyOn(findUserUseCase, 'execute').mockResolvedValue(user);
    expect(await controller.find(1)).toStrictEqual({
      message: 'User encontrado',
    });
  });

  it('should update a user and return a success message', async () => {
    const dto: UpdateUserDto = { name: 'Juan', email: 'juan@empresa.com' };
    const userId = 1;

    jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue(undefined);
    const result = await controller.update(userId, dto);
    expect(updateUserUseCase.execute).toHaveBeenCalledWith(userId, dto);
    expect(result).toEqual({ message: 'User updated' });
  });
});
